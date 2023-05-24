import { Icon } from '@chakra-ui/react';
import { MdBarChart, MdPerson, MdHome, MdLock, MdAccountTree } from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import SignUpCentered from 'views/auth/signUp';



const routes = [
	{
		name: 'Dashboard',
		layout: '/admin',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		path: '/marketplace',
		component: NFTMarketplace
	},
	{
		name: 'Stats',
		layout: '/admin',
		path: '/default',
		icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
		component: MainDashboard
	},
	{
		name: 'New Script',
		layout: '/admin',
		icon: <Icon as={MdAccountTree } width='20px' height='20px' color='inherit' />,
		path: '/data-tables',
		component: DataTables
	},
];

const adminRoutes = [
	{
		name: 'Profile',
		layout: '/admin',
		path: '/profile',
		icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
		component: Profile
	},
];

const authRoutes = [
	{
		name: 'Sign In',
		layout: '/auth',
		path: '/sign-in',
		icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
		component: SignInCentered
	},
	{
		name: 'Sign Up',
		layout: '/auth',
		path: '/sign-up',
		icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
		component: SignUpCentered
	}
];


export default routes;
