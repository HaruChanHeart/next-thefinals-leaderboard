import Head from 'next/head'
import { Montserrat } from 'next/font/google'
import { LeaderboardList } from '@/components/LeaderboardList'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const montserrat = Montserrat({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>THE FINALS Leaderboard Tracker</title>
      </Head>
      <main className={`${montserrat.className} container mx-auto max-w-7xl pt-16 px-6 flex-grow`}>
        <Header />
        <LeaderboardList />
        <Footer />
      </main>
    </>
  )
}
