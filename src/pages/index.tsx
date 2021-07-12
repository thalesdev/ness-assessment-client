import Head from 'next/head'
import { DashboardPage } from '../components/Layout/DashboardPage'

export default function Home() {
	return (
		<>
			<Head>
				<title>Devel - Dashboard</title>
			</Head>
			<DashboardPage>
			</DashboardPage>
		</>
	)
}
