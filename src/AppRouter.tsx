import pocketbaseEs from 'pocketbase';
import { createBrowserRouter, redirect } from 'react-router-dom';
import { DirectoryRecord } from './records';
import Callback from './views/Callback';
import Files from './views/Files';
import Layout from './views/Layout';
import Login from './views/Login';
import Error from './components/Error';

const expand =
	'parent,parent.parent,parent.parent.parent,parent.parent.parent.parent,parent.parent.parent.parent.parent,parent.parent.parent.parent.parent.parent';

const router = (client: pocketbaseEs) =>
	createBrowserRouter([
		{
			path: '/',
			element: <Layout />,
			loader: () => {
				if (!client.authStore.isValid) throw redirect('/login');
			},
			children: [
				{
					path: '/dir/:dirId',
					element: <Files />,
					loader: async ({ params }) => {
						const record = await client.collection('directory').getOne<DirectoryRecord>(params.dirId!!, {
							expand
						});
						return record;
					},
					errorElement: (
						<Error title='Fehler' description='Das angeforderte Verzeichnis wurde nicht gefunden.' />
					)
				},
				{
					path: '/dir',
					loader: async () => {
						if (client.authStore.model?.rootDirectory) {
							throw redirect('/dir/' + client.authStore.model?.rootDirectory);
						} else {
							const record = await client
								.collection('directory')
								.getFirstListItem<DirectoryRecord>(`parent = null`);
							throw redirect('/dir/' + record.id)
						}
					}
				}
			]
		},
		{
			path: '/login',
			element: <Login />,
			loader: async () => {
				return await client.collection('users').listAuthMethods()
			}
		},
		{
			path: '/callback/*',
			element: <Callback />
		}
	]);

export default router;
