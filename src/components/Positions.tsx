import { Button, ButtonGroup, Select, Stack, useToast } from "@chakra-ui/react"
import React, { useState } from "react"
import { mutate } from "swr";
import { api } from "../services/api";
import { EditablePopoverTextInput } from "./Form/Input"

enum SectionPositionType {
	goalkeeper,
	middle,
	defense,
	attack,
}

interface EditPositionFormProps {
	firstFieldRef: React.Ref<any>,
	onCancel(): void;
	initalData: {
		name: string;
		abbr: string;
		description?: string;
		id: string;
		section: SectionPositionType;
	}
}

export const EditPositionForm: React.FC<EditPositionFormProps> = ({ firstFieldRef, onCancel, initalData }) => {

	const [running, setRunning] = useState(false)
	const { name, abbr, id, description, section } = initalData;
	const [editName, setEditName] = useState(name)
	const [editAbbr, setEditAbbr] = useState(abbr)
	const [editDescription, setEditDescription] = useState(description)
	const [editSection, setEditSection] = useState<any>(section)
	const toast = useToast()

	async function handleUpdate(e) {
		e.preventDefault()
		setRunning(true)
		try {
			await api.put(`/positions/${id}`, {
				name: editName,
				abbr: editAbbr,
				section: editSection,
				description: editDescription,
			})
			toast({
				title: "Position was updated successful",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
			mutate(`/positions/${id}`, data => data, true)
			mutate(`/positions`, data => data, true)
			onCancel()
		} catch (error) {
			toast({
				title: "Error on update position",
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
			<EditablePopoverTextInput
				label="Description"
				id="description"
				defaultValue={description}
				onChange={e => setEditDescription(e.target.value)}
			/>
			<Select name="Section" defaultValue={section} onChange={e => {
				let pos = "goalkeeper";
				switch (Number(e.target.value)) {
					case SectionPositionType.defense:
						pos = "defense";
						break;
					case SectionPositionType.attack:
						pos = "attack";
						break;
					case SectionPositionType.middle:
						pos = "middle";
						break;
					default:
						pos = "goalkeeper";
						break;
				}
				setEditSection(pos)
			}}>
				<option value={SectionPositionType.goalkeeper}>Goalkeper</option>
				<option value={SectionPositionType.defense}>Defense</option>
				<option value={SectionPositionType.middle}>Middle</option>
				<option value={SectionPositionType.attack}>Attack</option>
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