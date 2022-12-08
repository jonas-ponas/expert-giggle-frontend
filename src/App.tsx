import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import Login from './views/Login';
import PocketBase from 'pocketbase';
import { PocketBaseProvider } from './util/PocketbaseContext';
import Callback from './views/Callback';
import Home from './views/Home';
import Layout from './views/Layout';

const client = new PocketBase('https://coach.ponas.dev');

const router = createBrowserRouter([
	
	{
		path: '/',
		element: <Layout />,
		children: [
			
			{
				path: '/callback/*',
				element: <Callback />
			},
			{
				path: '/',
				element: <Home />,
				loader: () => {
					if (!client.authStore.isValid) throw redirect('/login');
				}
			},
		]
	},
	{
		path: '/login',
		element: <Login />
	},
]);

export default function App() {
	return (
		<PocketBaseProvider value={client}>
			<RouterProvider router={router} />
		</PocketBaseProvider>
	);
}
