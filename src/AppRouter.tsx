import pocketbaseEs from 'pocketbase';
import { createBrowserRouter, redirect } from 'react-router-dom';
import { DirectoryRecord } from './records';
import Callback from './views/Callback';
import Files from './views/Files';
import Layout from './views/Layout';
import Login from './views/Login';
import ErrorAlert from './components/Error';

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
				// {
				// 	path: '/',
				// 	loader: () => {
				// 		throw redirect('/dir')
				// 	}
				// },
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
						<ErrorAlert title='Fehler' description='Das angeforderte Verzeichnis wurde nicht gefunden.' />
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
							throw redirect('/dir/' + record.id);
						}
					}
				}
			]
		},
		{
			path: '/login',
			element: <Login />,
			loader: async () => {
				return await client.collection('users').listAuthMethods();
			}
		},
		{
			path: '/callback/*',
			element: <></>,
			loader: async request => {
				const url = new URL(request.request.url);
				const code = url.searchParams.get('code');
				const state = url.searchParams.get('state');
				console.log(localStorage.getItem('provider'))
				const provider = JSON.parse(localStorage.getItem('provider') || '{}');
				if (!code || !state || !provider)
					throw new Error('Der O-Auth Provider hat nicht genug Parameter zurückgeliefert!');
				await client
					?.collection('users')
					.authWithOAuth2(provider.name, code, provider.codeVerifier, provider.redirectUrl);
				throw redirect('/');
			},
			errorElement: (
				<ErrorAlert title='Fehler!' description={`Es ist ein Fehler bei der Anmeldung unterlaufen!`} />
			)
		}
	]);

export default router;
