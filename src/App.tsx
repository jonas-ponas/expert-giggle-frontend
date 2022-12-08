import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import Login from './views/Login';
import PocketBase from 'pocketbase';
import PocketBaseContext from './util/PocketbaseContext';
import Callback from './views/Callback';
import Home from './views/Home';

const client = new PocketBase('https://coach.ponas.dev');

const router = createBrowserRouter([
	{
		path: '/login',
		element: <Login />
	},
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
	}
]);

export default function App() {
	return (
		<PocketBaseContext.Provider value={client}>
			<RouterProvider router={router} />
		</PocketBaseContext.Provider>
	);
}
