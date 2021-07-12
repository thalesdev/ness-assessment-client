import { Avatar } from "@chakra-ui/avatar";
import { IoCaretDown } from "react-icons/io5";
import { HiLogout, HiUserCircle } from 'react-icons/hi'
import { Box, Text, Menu, MenuButton, MenuList, PopoverArrow, IconButton, Icon, HStack } from "@chakra-ui/react";
import { MenuNavItem } from "../Navigation";

interface ProfileProps {
	showProfileData?: boolean;
}
export function Profile({ showProfileData = true }: ProfileProps) {


	return (
		<Menu>
			<MenuButton>
				<HStack spacing="4" align="center"  >
					{showProfileData && (
						<Box textAlign="right">
							<Text>Thales de Oliveira </Text>
							<Text color="gray.300" fontSize="small">
								thalesdev@furg.br
							</Text>
						</Box>
					)}
					<Avatar size="md" name="Thales de Oliveira" src="https://github.com/thalesdev.png" />
					<IconButton
						icon={<Icon as={IoCaretDown} color="gray.200" />}
						aria-label="Down Icon"
						variant="unstyled"
					/>
				</HStack>
			</MenuButton>
			<MenuList
				borderColor="rgba(0,0,0,0.05)"
				p={4}
			>
				<MenuNavItem Icon={HiUserCircle} title="My Profile" />
				<MenuNavItem Icon={HiLogout} title="Sign Out" />
			</MenuList>
		</Menu>
	)
}