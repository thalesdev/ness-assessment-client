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
import { api } from '../../services/api';
import { mutate } from 'swr';
import { EditPlayerForm } from '../../components/Players';

type PlayerData = {
	players: {
		id: string;
		name: string;
		abbr: string;
		position: {
			id: string;
			name: string;
			abbr: string;
		};
		contracts: {
			team: {
				name: string;
			}
		}[];
	}[]
}


export default function PlayerList() {

	const isWideVersion = useBreakpointValue({
		base: false,
		lg: true
	})

	const { data: players } = useFetch<PlayerData>('/players')
	const toast = useToast()

	async function handleDelete(playerId: string) {
		try {
			await api.delete(`/players/${playerId}`)
			mutate('/players', data => data, true) // force reload
			toast({
				title: "Player removed successfully",
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
				<title>Devel - Players</title>
			</Head>
			<Box flex="1" borderRadius={8} bg="gray.50" p="8">
				<Flex mb="8" justify="space-between" align="center">
					<Heading size="lg" fontWeight="normal">
						Players
					</Heading>
					<Link href="/players/create" passHref>
						<Button
							as="a"
							size="sm"
							fontSize="small"
							colorScheme="teal"
							leftIcon={<Icon as={RiAddLine} fontSize="20" />}
						>
							Create a New Player
						</Button>
					</Link>
				</Flex>
				<Table colorScheme="whiteAlpha">
					<Thead>
						<Tr>
							<Th>
								Name
							</Th>
							<Th>
								Position
							</Th>
							{isWideVersion && (
								<>
									<Th>
										Id
									</Th>
									<Th w="8" />
								</>
							)}
						</Tr>
					</Thead>

					<Tbody>
						{players?.players.map(player => (
							<Tr key={player.id}>
								<Td>
									<Text fontWeight="bold">
										{player.name}
									</Text>
								</Td>
								<Td>
									<Text fontWeight="bold">{player.position.name}</Text>
								</Td>
								{isWideVersion && (
									<>
										<Td>
											<Text fontWeight="bold">{player.id}</Text>
										</Td>
										<Td>
											<Button
												as="a"
												size="sm"
												fontSize="small"
												colorScheme="teal"
												cursor="pointer"
												leftIcon={<Icon as={RiDeleteBin7Fill} fontSize="16" />}
												onClick={(e) => handleDelete(player.id)}
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
												Form={EditPlayerForm}
												initalData={player}
											/>
										</Td>
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
