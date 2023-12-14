'use client'

import {
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from 'react'

import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Pagination,
    Spinner,
    Tooltip,
    Input,
    Select,
    SelectItem
} from '@nextui-org/react'

interface IRank {
    r: number,
    name: string,
    f: number,
    of: number,
    or: number,
    c: number,
    steam: string,
    xbox: string,
    psn: string
}

const platforms = [
    { value: 'crossplay', label: 'Crossplay (All)' },
    { value: 'steam', label: 'Steam (PC)' },
    { value: 'xbox', label: 'Xbox network' },
    { value: 'psn', label: 'PlayStation Network' },
]

function formatNumber(num: number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function LeaderboardList() {
    const [ page, setPage ] = useState(1)
    const [ leaderboard, setLeaderboard ] = useState([])
    const [ platform, setPlatform ] = useState<any>(Object.values(platforms[0])[0])
    const [ findName, setFindName ] = useState<string>('')

    const rowsPerPage = 100

    const fetchData = (platform: any) => {
        fetch(`https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform ?? 'crossplay'}-discovery-live.json`, {
            cache: 'reload'
        })
            .then((res) => res.json())
            .then((data) => setLeaderboard(data))
    }

    useEffect(() => {
        fetchData('crossplay')
    }, [])

    const pages = useMemo(() => {
        return leaderboard ? Math.ceil(leaderboard.length / rowsPerPage) : 0
    }, [leaderboard, rowsPerPage])

    const handleCategory = (e: { target: { value: SetStateAction<string | null> } }) => {
        const p: any = e.target.value
        fetchData(p)
        setPlatform(p)
    }

    const splitEmbarkId = (item: string) => {
        const a = item.split('#')
        return (
            <>
                <span>{a[0]}</span>
                <span className='text-zinc-500'>#{a[1]}</span>
            </>
        )
    }

    const loadingState = leaderboard.length === 0 ? 'loading' : 'idle'

    return (
        <>
            <div className='flex w-full flex-wrap md:flex-nowrap gap-4 my-5'>
                <Input type='text' label={platform === 'crossplay' ? 'Search Embark ID' : 'Search Name'} onChange={(e) => {
                    setPage(1)
                    setFindName(e.target.value)
                }} />
                <Select
                    label='Platform'
                    defaultSelectedKeys={['crossplay']}
                    className='max-w-sx'
                    onChange={handleCategory}
                >
                    {platforms.map((value) => (
                        <SelectItem key={value.value} value={value.value}>
                            {value.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>
            <Table
                isHeaderSticky
                aria-label='The Finals Leaderboards'
                bottomContent={
                    pages > 0 && !findName ? (
                        <div className='flex w-full justify-center'>
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color='primary'
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    ) : null
                }
                classNames={{
                    wrapper: 'min-h-[222px]'
                }}
            >
                <TableHeader>
                    <TableColumn>RANK</TableColumn>
                    <TableColumn>24H</TableColumn>
                    <TableColumn>{platform === 'crossplay' ? 'EMBARK ID' : 'NAME'}</TableColumn>
                    <TableColumn>CASHOUTS</TableColumn>
                    <TableColumn>FAME</TableColumn>
                    <TableColumn>PLATFORM</TableColumn>
                </TableHeader>
                <TableBody
                    items={
                        leaderboard
                        .filter((items: {name: string}) => items.name.includes(findName))
                        .slice((page - 1) * rowsPerPage, page * rowsPerPage) ?? []
                    }
                    loadingContent={<Spinner />}
                    loadingState={loadingState}
                >
                    {(item: IRank) => (
                        <TableRow
                            key={item.name}
                        >
                            <TableCell>{formatNumber(item.r)}</TableCell>
                            <TableCell>{item.or - item.r}</TableCell>
                            <TableCell>
                                {
                                    platform === 'crossplay' ? splitEmbarkId(item.name) : item.name
                                }
                            </TableCell>
                            <TableCell>{formatNumber(item.c)}</TableCell>
                            <TableCell>
                                <div className='flex gap-1'>
                                    <span>{formatNumber(item.f)}</span>
                                    <span className='text-sm text-zinc-500'>({formatNumber(item.f - item.of)})</span>
                                </div>
                            </TableCell>
                            <TableCell className='flex gap-2 text-2xl'>
                                {
                                    item.steam !== '' || platform === 'steam' ?
                                        <Tooltip content={platform === 'steam' ? 'Steam' : item.steam}>
                                            <i className='fa-brands fa-steam' />
                                        </Tooltip>
                                    : ''
                                }
                                {
                                    item.xbox !== '' || platform === 'xbox' ?
                                        <Tooltip content={platform === 'xbox' ? 'Xbox' : item.xbox}>
                                            <i className='fa-brands fa-xbox text-success-600 dark:text-sucess-500' />
                                        </Tooltip>
                                    : ''}
                                {
                                    item.psn !== '' || platform === 'psn' ?
                                        <Tooltip content={platform === 'psn' ? 'PlayStation' : item.psn}>
                                            <i className='fa-brands fa-playstation text-primary-600 dark:text-primary-500' />
                                        </Tooltip>
                                    : ''}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}