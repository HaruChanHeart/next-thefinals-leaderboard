export function Footer() {
    const fullyear = new Date().getFullYear()
    return (
        <footer className='w-full flex flex-col gap-1 items-center justify-center py-20'>
            <span>&copy; {fullyear} HaruChanHeart</span>
            <p className='text-sm dark:text-zinc-600'>This website is not affiliated with or endorsed by Embark Studios AB. THE FINALS&reg; is a registered trademark of Embark Studio AB.</p>
        </footer>
    )
}