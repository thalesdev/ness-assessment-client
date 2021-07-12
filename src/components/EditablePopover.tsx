import { EditIcon } from "@chakra-ui/icons"
import { Button, ButtonGroup, FormControl, FormLabel, Input, Popover, PopoverArrow, PopoverCloseButton, PopoverContent, PopoverTrigger, Stack, useDisclosure, IconButton } from "@chakra-ui/react"
import React from "react"
import FocusLock from "react-focus-lock"


interface FormProps {
	firstFieldRef: React.Ref<any>
	onCancel(): void
}

interface EditablePopoverProps {
	target?: React.ReactNode;
	Form: React.FC<any>
	initalData: any
}



export function EditablePopover({ target, Form, initalData }: EditablePopoverProps) {
	const { onOpen, onClose, isOpen } = useDisclosure()
	const firstFieldRef = React.useRef(null)


	return (
		<>
			<Popover
				isOpen={isOpen}
				initialFocusRef={firstFieldRef}
				onOpen={onOpen}
				onClose={onClose}
				placement="right"
				closeOnBlur={false}
				isLazy
			>
				<PopoverTrigger>
					{target}
				</PopoverTrigger>
				<PopoverContent p={5}>
					<FocusLock returnFocus persistentFocus={false}>
						<PopoverArrow />
						<PopoverCloseButton />
						<Form firstFieldRef={firstFieldRef} onCancel={onClose} initalData={initalData} />
					</FocusLock>
				</PopoverContent>
			</Popover>
		</>
	)
}