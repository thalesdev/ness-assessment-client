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
	Checkbox,
	Tbody,
	Td,
	Text,
	useBreakpointValue,
	useToast
} from '@chakra-ui/react';
import Link from 'next/link';
import Head from 'next/head'
import { RiAddLine, RiDeleteBin7Fill, RiDeleteBin7Line, RiEdit2Fill, RiPencilLine } from 'react-icons/ri';
import { DashboardPage } from '../../components/Layout/DashboardPage';
import { Pagination } from '../../components/Pagination';
import useFetch from '../../hooks/useFetch';
import { EditablePopover } from '../../components/EditablePopover';
import { EditTeamForm } from '../../components/Teams';
import { api } from '../../services/api';
import { mutate } from 'swr';

type TeamData = {
	teams: {
		id: string;
		name: string;
		abbr: string;
		players: any[];
	}[]
}


export default function TeamsList() {

	const isWideVersion = useBreakpointValue({
		base: false,
		lg: true
	})

	const { data: teams } = useFetch<TeamData>('/teams')
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
				<title>Devel - Teams</title>
			</Head>
			<Box flex="1" borderRadius={8} bg="gray.50" p="8">
				<Flex mb="8" justify="space-between" align="center">
					<Heading size="lg" fontWeight="normal">
						Teams
					</Heading>
					<Link href="/teams/create" passHref>
						<Button
							as="a"
							size="sm"
							fontSize="small"
							colorScheme="teal"
							leftIcon={<Icon as={RiAddLine} fontSize="20" />}
						>
							Create New Team
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
								Abbr.
							</Th>
							<Th>
								Players
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
						{teams?.teams.map(team => (
							<Tr key={team.id}>
								<Td>
									<Box as={Link} href={`/teams/${team.id}`} passHref>
										<Text fontWeight="bold" _hover={{ textDecoration: 'underline' }} cursor="pointer">
											{team.name}
										</Text>
									</Box>
								</Td>
								<Td>
									<Text fontWeight="bold">{team.abbr}</Text>
								</Td>
								<Td>
									<Text fontWeight="bold">{team.players.length}</Text>
								</Td>
								{isWideVersion && (
									<>
										<Td>
											<Text fontWeight="bold">{team.id}</Text>
										</Td>
										<Td>
											<Button
												as="a"
												size="sm"
												fontSize="small"
												colorScheme="teal"
												cursor="pointer"
												leftIcon={<Icon as={RiDeleteBin7Fill} fontSize="16" />}
												onClick={(e) => handleDelete(team.id)}
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
