import { Image } from "@nextui-org/react"

export function Header() {
    const fullyear = new Date().getFullYear()
    return (
        <header className='w-full flex flex-col gap-1 items-center justify-center py-20'>
            <Image
                isBlurred
                radius='none'
                src='/logo.svg'
                width={'100%'}
                alt='THE FINALS LOGO'
                className='my-2'
            />
            <p className='text-xl dark:text-zinc-400'>Unofficial Leaderboard Tracker</p>
        </header>
    )
}