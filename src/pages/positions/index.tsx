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
import { EditTeamForm } from '../../components/Teams';
import { api } from '../../services/api';
import { mutate } from 'swr';
import { EditPositionForm } from '../../components/Positions';

enum PositionSectionType {
	goalkeeper,
	middle,
	defense,
	attack,
}

type PositionData = {
	positions: {
		id: string;
		name: string;
		abbr: string;
		section: PositionSectionType;
		description?: any;
	}[]
}


export default function TeamsList() {

	const isWideVersion = useBreakpointValue({
		base: false,
		lg: true
	})

	const { data: positions } = useFetch<PositionData>('/positions')
	const toast = useToast()

	async function handleDelete(positionId: string) {
		try {
			await api.delete(`/positions/${positionId}`)
			mutate('/positions', data => data, true) // force reload
			toast({
				title: "Position removed successfully",
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
				<title>Devel - Positions</title>
			</Head>
			<Box flex="1" borderRadius={8} bg="gray.50" p="8">
				<Flex mb="8" justify="space-between" align="center">
					<Heading size="lg" fontWeight="normal">
						Positions
					</Heading>
					<Link href="/positions/create" passHref>
						<Button
							as="a"
							size="sm"
							fontSize="small"
							colorScheme="teal"
							leftIcon={<Icon as={RiAddLine} fontSize="20" />}
						>
							Create New Position
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
								Section
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
						{positions?.positions.map(position => (
							<Tr key={position.id}>
								<Td>
									<Text fontWeight="bold" cursor="pointer">
										{position.name}
									</Text>
								</Td>
								<Td>
									<Text fontWeight="bold">{position.abbr}</Text>
								</Td>
								<Td>
									<Text fontWeight="bold">{position.section}</Text>
								</Td>
								{isWideVersion && (
									<>
										<Td>
											<Text fontWeight="bold">{position.id}</Text>
										</Td>
										<Td>
											<Button
												as="a"
												size="sm"
												fontSize="small"
												colorScheme="teal"
												cursor="pointer"
												leftIcon={<Icon as={RiDeleteBin7Fill} fontSize="16" />}
												onClick={(e) => handleDelete(position.id)}
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
												Form={EditPositionForm}
												initalData={position}
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
