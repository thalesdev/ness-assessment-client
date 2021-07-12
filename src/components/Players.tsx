import { Button, ButtonGroup, Stack, useToast, Select } from "@chakra-ui/react"
import React, { useState } from "react"
import { mutate } from "swr";
import useFetch from "../hooks/useFetch";
import { api } from "../services/api";
import { EditablePopoverTextInput } from "./Form/Input"

interface EditPlayerFormProps {
	firstFieldRef: React.Ref<any>,
	onCancel(): void;
	initalData: {
		name: string;
		position: {
			name: string;
			id: string;
		};
		id: string;
	}
}
interface PositionDataType {
	positions: {
		name: string;
		abbr: string;
		id: string;
	}[]
}

export const EditPlayerForm: React.FC<EditPlayerFormProps> = ({ firstFieldRef, onCancel, initalData }) => {

	const { data: positionData } = useFetch<PositionDataType>('/positions')

	const [running, setRunning] = useState(false)
	const { name, position, id } = initalData;
	const [editName, setEditName] = useState(name)
	const [editPosId, setEditPosId] = useState(position.id)
	const toast = useToast()

	async function handleUpdate(e) {
		e.preventDefault()
		setRunning(true)
		try {
			await api.put(`/players/${id}`, {
				name: editName,
				positionId: editPosId,
			})
			toast({
				title: "Player was updated successful",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
			mutate(`/players/${id}`, data => data, true)
			mutate(`/players`, data => data, true)
			onCancel()
		} catch (error) {
			toast({
				title: "Error on update Player",
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
			<Select
				defaultValue={position.id}
				onChange={e => setEditPosId(e.target.value)}
			>
				{positionData?.positions.map(position => (
					<option key={position.id} value={position.id}>
						{position.abbr}({position.name})
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