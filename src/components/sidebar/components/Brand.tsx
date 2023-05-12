// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { ReactComponent as Logo } from 'assets/img/Logo.svg';
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand() {
	//   Chakra color mode
	let logoColor = useColorModeValue('navy.700', 'white');

	return (
		<Flex alignItems='center' flexDirection='column'>
			<Logo color={logoColor} />
			<HSeparator mb='20px' mt='10px' />
		</Flex>
	);
}

export default SidebarBrand;
