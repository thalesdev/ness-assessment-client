import { Button, ButtonGroup, Select, Stack, useToast } from "@chakra-ui/react"
import React, { useState } from "react"
import { mutate } from "swr";
import useFetch from "../hooks/useFetch";
import { api } from "../services/api";
import { EditablePopoverTextInput } from "./Form/Input"

interface EditTeamFormProps {
	firstFieldRef: React.Ref<any>,
	onCancel(): void;
	initalData: {
		teamId: string;
	}
}
type PlayerData = {
	players: {
		id: string;
		name: string;
		position: {
			abbr: string;
		};
	}[]
}


export const EditTeamForm: React.FC<EditTeamFormProps> = ({ firstFieldRef, onCancel, initalData }) => {

	const [running, setRunning] = useState(false)
	const { name, abbr, id } = initalData;
	const [editName, setEditName] = useState(name)
	const [editAbbr, setEditAbbr] = useState(abbr)
	const toast = useToast()

	async function handleUpdate(e) {
		e.preventDefault()
		setRunning(true)
		try {
			const response = await api.put(`/teams/${id}`, {
				name: editName,
				abbr: editAbbr,
			})
			toast({
				title: "Team was updated successful",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
			mutate(`/teams/${id}`, data => data, true)
			mutate(`/teams`, data => data, true)
			onCancel()
		} catch (error) {
			toast({
				title: "Error on update Team",
				duration: 5000,
				isClosable: true,
				status: "error",
				position: "top-right"
			})
		} finally {
			setRunning(false)
		}
	}

	return (
		<Stack spacing={4}>
			<EditablePopoverTextInput
				label="Name"
				id="name"
				ref={firstFieldRef}
				defaultValue={name}
				onChange={e => setEditName(e.target.value)}
			/>
			<EditablePopoverTextInput
				label="Abbr."
				id="abbr"
				defaultValue={abbr}
				onChange={e => setEditAbbr(e.target.value)}
			/>
			<ButtonGroup d="flex" justifyContent="flex-end">
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button colorScheme="teal" onClick={handleUpdate} isLoading={running}>
					Save
				</Button>
			</ButtonGroup>
		</Stack>
	)
}


export const AddPlayerTeamForm: React.FC<EditTeamFormProps> = ({ firstFieldRef, onCancel, initalData }) => {


	const { data: playersData } = useFetch<PlayerData>('/players')
	const { teamId } = initalData


	const [running, setRunning] = useState(false)
	const [playerId, setPlayerId] = useState(null)
	const [salary, setSalary] = useState(0)
	const [startAt, setStartAt] = useState(null)
	const [endAt, setEndAt] = useState(null)
	const toast = useToast()

	async function handleUpdate(e) {
		e.preventDefault()
		setRunning(true)
		try {
			await api.post(`/teams/players`, {
				teamId,
				playerId,
				endAt,
				startAt,
				salary
			})
			toast({
				title: "Player was added to team successful",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
			mutate(`/teams/${teamId}`, data => data, true)
			mutate(`/teams`, data => data, true)
			onCancel()
		} catch (error) {
			console.log(error.response.data)
			toast({
				title: "Error on add player to team",
				description: error.response.data?.message,
				duration: 5000,
				isClosable: true,
				status: "error",
				position: "top-right"
			})
		} finally {
			setRunning(false)
		}
	}

	return (
		<Stack spacing={4}>
			<EditablePopoverTextInput
				label="Salary"
				id="salary"
				type="salary"
				ref={firstFieldRef}
				onChange={e => setSalary(e.target.value)}
			/>
			<EditablePopoverTextInput
				label="Start Date"
				id="startAt"
				type="date"
				ref={firstFieldRef}
				onChange={e => setStartAt(e.target.value)}
			/>
			<EditablePopoverTextInput
				label="End Date"
				id="endAt"
				type="date"
				ref={firstFieldRef}
				onChange={e => setEndAt(e.target.value)}
			/>

			<Select
				onChange={e => setPlayerId(e.target.value)}
			>
				{playersData?.players.map(player => (
					<option key={player.id} value={player.id}>
						{player.name}({player.position.abbr})
					</option>
				))}
			</Select>

			<ButtonGroup d="flex" justifyContent="flex-end">
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button colorScheme="teal" onClick={handleUpdate} isLoading={running}>
					Save
				</Button>
			</ButtonGroup>
		</Stack>
	)
}