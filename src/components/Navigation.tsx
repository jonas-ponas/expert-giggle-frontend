import React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, Paper, useTheme } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { usePocketbase } from '../util/PocketbaseContext';

export default function Navigation(props: {}) {
	const theme = useTheme();
	const client = usePocketbase();
	const navigate = useNavigate();

	function logout() {
		client?.authStore.clear();
		navigate('/login');
	}

	return (
		<nav>
			<List component={Paper}>
				<ListItemButton LinkComponent={RouterLink} href='/dir'>
					<ListItemIcon>
						<Icon name='folders' style='line' size='lg' />
					</ListItemIcon>
					<ListItemText primary='Dateien' />
				</ListItemButton>
				<ListItemButton disabled={true} LinkComponent={RouterLink} href='/schedule'>
					<ListItemIcon>
						<Icon name='calendar-todo' style='line' size='lg' />
					</ListItemIcon>
					<ListItemText primary='Stundenplan' />
				</ListItemButton>
				<ListItemButton disabled={true} LinkComponent={RouterLink} href='/news'>
					<ListItemIcon>
						<Icon name='rss' style='line' size='lg' />
					</ListItemIcon>
					<ListItemText primary='Coach News' />
				</ListItemButton>
			</List>
			<List component={Paper} sx={{ mt: theme.spacing(2) }}>
				<ListItemButton LinkComponent={RouterLink} href='/settings'>
					<ListItemIcon>
						<Icon name='user-settings' style='line' size='lg' />
					</ListItemIcon>
					<ListItemText primary='Einstellungen' />
				</ListItemButton>
				<ListItemButton onClick={logout}>
					<ListItemIcon>
						<Icon name='logout-box' style='line' size='lg' />
					</ListItemIcon>
					<ListItemText primary='Abmelden' />
				</ListItemButton>
			</List>
		</nav>
	);
}
