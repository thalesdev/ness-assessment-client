
import {
	Box,
	Divider,
	Flex,
	Heading,
	VStack,
	SimpleGrid,
	HStack,
	Button,
	useToast,
	Select
} from '@chakra-ui/react';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';


import { Input } from '../../components/Form/Input';
import { DashboardPage } from '../../components/Layout/DashboardPage';
import { api } from '../../services/api';
import { mutate } from 'swr';
import useFetch from '../../hooks/useFetch';


type PlayerCreateFormData = {
	name: string;
	position: string;
};

interface PositionDataType {
	positions: {
		name: string;
		abbr: string;
		id: string;
	}[]
}

const playerCreateFormSchema = yup.object().shape({
	name: yup.string().required('Player name is a required field'),
	position: yup.string().required('Position is a required field'),
});



export default function PlayerCreate() {


	const { data: positionData } = useFetch<PositionDataType>('/positions')
	const { formState, handleSubmit, register } = useForm({ resolver: yupResolver(playerCreateFormSchema) })
	const { errors } = formState

	const toast = useToast()

	const handleCreatePlayer: SubmitHandler<PlayerCreateFormData> = async ({ name, position }) => {
		try {
			await api.post(`/players`, {
				name,
				positionId: position
			})
			mutate('/players', data => data, true)
			toast({
				title: "Player successfully added",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
			Router.push('/players')
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
				<title>Devel - Create a Player</title>
			</Head>
			<Box
				flex="1"
				display="flex"
				flexDirection="column"
				borderRadius={8}
				bg="gray.50"
				p={["6", "8"]}
				as="form"
				onSubmit={handleSubmit(handleCreatePlayer)}
			>
				<Heading size="lg" fontWeight="normal">
					Create a Team
				</Heading>
				<Divider my="6" borderColor="gray.100" />
				<VStack spacing="8">
					<SimpleGrid minChildWidth="240px" spacing={["6", "8"]} width="100%">
						<Input
							name="name"
							label="Team Name"
							{...register('name')}
							error={errors.name}
						/>
						<Select
							name="position"
							label="Position"
							{...register('position')}
							error={errors.position}
						>
							{positionData?.positions.map(position => (
								<option key={position.id} value={position.id}>
									{position.abbr}({position.name})
								</option>
							))}
						</Select>

					</SimpleGrid>
				</VStack>

				<Flex flex="1" mt="8" align="flex-end" justify="flex-end">
					<HStack spacing="4">
						<Link href="/teams" passHref>
							<Button as="a" colorScheme="gray">Cancel</Button>
						</Link>
						<Button colorScheme="teal" type="submit" isLoading={formState.isSubmitting}>
							Create
						</Button>
					</HStack>
				</Flex>

			</Box>

		</DashboardPage>
	);
}
