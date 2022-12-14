import React from 'react';
import { Alert, AlertTitle, Avatar, Box, Chip, Typography, useTheme } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { usePocketbase } from '../util/PocketbaseContext';
import CoachDataTable from '../components/CoachDataTable';
import Icon from '../components/Icon';
import pocketbaseEs, { ExternalAuth, Record } from 'pocketbase';
import SettingsTable from '../components/SettingsTable';
import { DirectoryRecord, StateRecord } from '../records';

export function loadUserSettings(client: pocketbaseEs) {
	return async () => {
		let rootDir: DirectoryRecord | null = null;
		let authProviders: ExternalAuth[] = [];
		let state: StateRecord | null = null;
		if (client.authStore.model?.rootDirectory) {
			try {
				rootDir = await client
					.collection('directory')
					.getOne(client.authStore.model?.rootDirectory);
			} catch (e) {}
		}
		try {
			authProviders = await client
				.collection('users')
				.listExternalAuths(client.authStore.model!!.id);
		} catch (e) {}

		try {
			state = await client
				.collection('state')
				.getFirstListItem(`user.id = "${client.authStore.model!!.id}"`);
		} catch (e) {}
		return {
			state,
			rootDir,
			authProviders
		};
	}
}

export default function UserSettings(props: {}) {
	const theme = useTheme();
	const { rootDir, state, authProviders } = useLoaderData() as {
		rootDir: DirectoryRecord;
		state: StateRecord;
		authProviders: ExternalAuth[];
	};
	const client = usePocketbase();
	const authProvider = authProviders ? authProviders[0].provider : 'none';
	let avatar = client?.authStore.model?.avatarUrl;
	console.log();
	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center'
				}}>
				<Avatar src={avatar} alt={(client?.authStore.model?.username || 'u').toUpperCase()} />
				<Box sx={{ ml: theme.spacing(2) }}>
					<Typography variant='h6'>{client?.authStore.model?.name}</Typography>
					<Chip
						icon={
							<Box sx={{ height: '1em', color: 'inherit' }}>
								<Icon name={authProvider} style='line' size='fw' />
							</Box>
						}
						label={authProvider == 'github' ? 'Github' : authProvider == 'google' ? 'Google' : 'unbekannt'}
						variant='outlined'
						color='info'
						size='small'
					/>
				</Box>
			</Box>
			<Box
				sx={{
					mt: theme.spacing(2)
				}}>
				<SettingsTable state={state} rootDir={rootDir} />
			</Box>
			<Box
				sx={{
					mt: theme.spacing(2)
				}}>
				{state != null && <CoachDataTable data={state} />}
				{state == null && (
					<Alert variant='filled' severity='warning'>
						<AlertTitle>Kein Coach verbunden!</AlertTitle>
						Verbinden Sie einen Coach ??ber den Button "Verbinden"
					</Alert>
				)}
			</Box>
		</Box>
	);
}
