
import {
	Box,
	Divider,
	Flex,
	Heading,
	VStack,
	SimpleGrid,
	HStack,
	Button,
	useToast
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


type TeamCreateFormData = {
	name: string;
	abbr: string;
	foundationAt: Date;
};

const teamCreateFormSchema = yup.object().shape({
	name: yup.string().required('Team name is a required field'),
	abbr: yup.string().required('Team abbr is a required field'),
	foundationAt: yup.date().required('Team foundation date is a required field'),
});



export default function TeamCreate() {

	const { formState, handleSubmit, register } = useForm({ resolver: yupResolver(teamCreateFormSchema) })
	const { errors } = formState

	const toast = useToast()

	const handleCreateTeam: SubmitHandler<TeamCreateFormData> = async (values) => {
		try {
			await api.post(`/teams`, {
				...values
			})
			mutate('/teams', data => data, true)
			toast({
				title: "Team successfully added",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
			Router.push('/teams')
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
				<title>Devel - Create a Team</title>
			</Head>
			<Box
				flex="1"
				display="flex"
				flexDirection="column"
				borderRadius={8}
				bg="gray.50"
				p={["6", "8"]}
				as="form"
				onSubmit={handleSubmit(handleCreateTeam)}
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
						<Input
							name="abbr"
							label="Team abbr"
							{...register('abbr')}
							error={errors.abbr}
						/>
					</SimpleGrid>
					<SimpleGrid minChildWidth="240px" spacing={["6", "8"]} width="100%">
						<Input
							type="date"
							name="foundationAt"
							label="Team Foundation date"
							{...register('foundationAt')}
							error={errors.foundationAt}
						/>
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
