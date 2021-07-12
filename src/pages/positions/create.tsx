
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


type PositionCreateFormData = {
	name: string;
	abbr: string;
	foundationAt: Date;
};

const positionCreateFormSchema = yup.object().shape({
	name: yup.string().required('Position name is a required field'),
	abbr: yup.string().required('Position abbr is a required field'),
	section: yup.string().required('Position section is a required field'),
	description: yup.string().optional(),
});



export default function PositionCreate() {

	const { formState, handleSubmit, register } = useForm({ resolver: yupResolver(positionCreateFormSchema) })
	const { errors } = formState

	const toast = useToast()

	const handleCreatePosition: SubmitHandler<PositionCreateFormData> = async (values) => {
		try {
			await api.post(`/positions`, {
				...values
			})
			mutate('/positions', data => data, true)
			toast({
				title: "Position successfully added",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
			Router.push('/positions')
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
				<title>Devel - Create a Position</title>
			</Head>
			<Box
				flex="1"
				display="flex"
				flexDirection="column"
				borderRadius={8}
				bg="gray.50"
				p={["6", "8"]}
				as="form"
				onSubmit={handleSubmit(handleCreatePosition)}
			>
				<Heading size="lg" fontWeight="normal">
					Create a Team
				</Heading>
				<Divider my="6" borderColor="gray.100" />
				<VStack spacing="8">
					<SimpleGrid minChildWidth="240px" spacing={["6", "8"]} width="100%">
						<Input
							name="name"
							label="Position Name"
							{...register('name')}
							error={errors.name}
						/>
						<Input
							name="abbr"
							label="Position abbr"
							{...register('abbr')}
							error={errors.abbr}
						/>
					</SimpleGrid>
					<SimpleGrid minChildWidth="240px" spacing={["6", "8"]} width="100%">
						<Input
							name="description"
							label="Position Description"
							{...register('description')}
							error={errors.description}
						/>
						<Select
							name="section"
							label="Position Section"
							{...register('section')}
							error={errors.section}
						>
							<option value={"goalkeeper"}>Goalkeper</option>
							<option value={"defense"}>Defense</option>
							<option value={"middle"}>Middle</option>
							<option value={"attack"}>Attack</option>
						</Select>
					</SimpleGrid>
				</VStack>

				<Flex flex="1" mt="8" align="flex-end" justify="flex-end">
					<HStack spacing="4">
						<Link href="/positions" passHref>
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
