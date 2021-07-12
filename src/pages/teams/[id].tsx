import {
	Box,
	Flex,
	Heading,
	Button,
	Icon,
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Text,
	useBreakpointValue,
	useToast
} from '@chakra-ui/react';
import Link from 'next/link';
import Head from 'next/head'
import { RiAddLine, RiDeleteBin7Fill, RiEdit2Fill } from 'react-icons/ri';
import { DashboardPage } from '../../components/Layout/DashboardPage';
import { Pagination } from '../../components/Pagination';
import useFetch from '../../hooks/useFetch';
import { EditablePopover } from '../../components/EditablePopover';
import { AddPlayerTeamForm, EditTeamForm } from '../../components/Teams';
import { api } from '../../services/api';
import { mutate } from 'swr';
import { useRouter } from 'next/router';

type TeamData = {
	id: string;
	name: string;
	abbr: string;
	players: {
		id: string;
		salary: number;
		endAt: Date;
		player: {
			id: string;
			name: string;
		}
	}[];
}


export default function TeamsList() {

	const isWideVersion = useBreakpointValue({
		base: false,
		lg: true
	})

	const { query: { id } } = useRouter()

	const { data: teamData } = useFetch<TeamData>(id ? `/teams/${id}` : null)
	const toast = useToast()

	async function handleDelete(teamId: string) {
		try {
			await api.delete(`/teams/${teamId}`)
			mutate('/teams', data => data, true) // force reload
			toast({
				title: "Team removed successfully",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
		} catch (error) {
			toast({
				title: "An error has occurred",
				description: error.response.data?.message,
				duration: 5000,
				isClosable: true,
				status: "error",
				position: "top-right"
			})
		}
	}


	return (
		<DashboardPage>
			<Head>
				<title>Devel - {teamData?.name} Players</title>
			</Head>
			<Box flex="1" borderRadius={8} bg="gray.50" p="8">
				<Flex mb="8" justify="space-between" align="center">
					<Heading size="lg" fontWeight="normal">
						{teamData?.abbr} ({teamData?.name}) Player Contracts
					</Heading>
					<EditablePopover target={
						<Button
							as="a"
							size="sm"
							fontSize="small"
							colorScheme="teal"
							leftIcon={<Icon as={RiAddLine} fontSize="20" />}
						>
							Add player to a team
						</Button>}
						Form={AddPlayerTeamForm}
						initalData={{ teamId: id }}
					/>


				</Flex>
				<Table colorScheme="whiteAlpha">
					<Thead>
						<Tr>
							<Th>
								Player name
							</Th>
							<Th>
								Salary
							</Th>
							<Th>
								End Contract
							</Th>
							{isWideVersion && (
								<>
									<Th>
										Id Contract
									</Th>
									<Th w="8" />
								</>
							)}
						</Tr>
					</Thead>

					<Tbody>
						{teamData?.players.map(contract => (
							<Tr key={contract.id}>
								<Td>
									<Text fontWeight="bold">
										{contract.player.name}
									</Text>
								</Td>
								<Td>
									<Text fontWeight="bold">{contract.salary}</Text>
								</Td>
								<Td>
									<Text fontWeight="bold">{new Date(contract.endAt).toLocaleString('pt-BR', {
										year: 'numeric',
										day: '2-digit',
										month: '2-digit'
									})}</Text>
								</Td>
								{isWideVersion && (
									<>
										<Td>
											<Text fontWeight="bold">{contract.id}</Text>
										</Td>
										{/* <Td>
											<Button
												as="a"
												size="sm"
												fontSize="small"
												colorScheme="teal"
												cursor="pointer"
												leftIcon={<Icon as={RiDeleteBin7Fill} fontSize="16" />}
												onClick={(e) => handleDelete(contract.id)}
											>
												Delete
											</Button>
										</Td>
										<Td>
											<EditablePopover target={
												<Button
													as="a"
													size="sm"
													fontSize="small"
													colorScheme="teal"
													cursor="pointer"
													leftIcon={<Icon as={RiEdit2Fill} fontSize="16" />}>
													Editar
												</Button>}
												Form={EditTeamForm}
												initalData={team}
											/>
										</Td> */}
									</>
								)}
							</Tr>
						))}

					</Tbody>
				</Table>

				<Pagination />
			</Box>

		</DashboardPage>
	);
}
