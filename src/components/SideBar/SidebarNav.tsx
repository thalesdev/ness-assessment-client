import { Stack } from "@chakra-ui/react";
import { FaUserPlus, FaUsers, FaWarehouse } from 'react-icons/fa'
import { CgSmartHomeWashMachine } from 'react-icons/cg'
import { RiDashboardLine } from "react-icons/ri";

import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {



	return (
		<Stack spacing="12" align="flex-start">
			<>
				<NavSection title="Dashboard">
					<NavLink icon={RiDashboardLine} href="/teams">Teams</NavLink>
					<NavLink icon={FaUsers} href="/positions" >Positions</NavLink>
					<NavLink icon={FaUserPlus} href="/players" >Players</NavLink>
				</NavSection>

			</>
		</Stack>
	)
}