import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Icon from './Icon';

export default function Navigation(props: {}) {
	const theme = useTheme();
	return (
		<nav>
			<List
				component={Paper}
				sx={{
					mt: theme.spacing(2),
					ml: theme.spacing(2)
				}}>
				<ListItemButton LinkComponent={RouterLink} href='/'>
					<ListItemIcon>
						<Icon name='folders' style='line' size='lg' />
					</ListItemIcon>
					<ListItemText primary='Dateien' />
				</ListItemButton>
				<ListItemButton LinkComponent={RouterLink} href='/schedule'>
					<ListItemIcon>
						<Icon name='calendar-todo' style='line' size='lg' />
					</ListItemIcon>
					<ListItemText primary='Stundenplan' />
				</ListItemButton>
				<ListItemButton LinkComponent={RouterLink} href='/news'>
					<ListItemIcon>
						<Icon name='rss' style='line' size='lg' />
					</ListItemIcon>
					<ListItemText primary='Coach News' />
				</ListItemButton>
			</List>
			<List
				component={Paper}
				sx={{
					mt: theme.spacing(2),
					ml: theme.spacing(2)
				}}>
				<ListItemButton LinkComponent={RouterLink} href='/settings'>
					<ListItemIcon>
						<Icon name='user-settings' style='line' size='lg' />
					</ListItemIcon>
					<ListItemText primary='Einstellungen' />
				</ListItemButton>
				<ListItemButton LinkComponent={RouterLink} href='#logout'>
					<ListItemIcon>
						<Icon name='logout-box' style='line' size='lg' />
					</ListItemIcon>
					<ListItemText primary='Abmelden' />
				</ListItemButton>
			</List>
		</nav>
	);
}
