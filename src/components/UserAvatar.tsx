import { FolderDeleteTwoTone, HelpCenterTwoTone, LogoutTwoTone } from '@mui/icons-material';
import { Avatar, Menu, useTheme, MenuItem, IconButton, ListItemIcon } from '@mui/material';
import React, { useContext, useState } from 'react';
import PocketBaseContext from '../util/PocketbaseContext';
import InformationDialog from './InformationDialog';

export default function UserAvatar(props: {}) {
	const theme = useTheme();
	const client = useContext(PocketBaseContext);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [showInfoDialog, setShowInfoDialog] = useState(false);
	const open = Boolean(anchorEl);

	const avatar = `https://coach.ponas.dev/api/files/${client?.authStore.model?.collectionId}/${client?.authStore.model?.id}/${client?.authStore.model?.avatar}`;
	const firstLetter = (client?.authStore.model?.username[0] || '?').toUpperCase();

	function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
		setAnchorEl(event.currentTarget);
	}

	function handleLogout() {
		client?.authStore.clear();
		window.location.href = '/';
	}

	function resetRootFolder() {
		if (!client) return;
		client
			?.collection('users')
			.update(client.authStore.model?.id || '', {
				rootDirectory: null
			})
			.then(() => {
				setAnchorEl(null);
			});
	}

	return (
		<>
			<IconButton
				aria-label=''
				onClick={handleClick}
				sx={{
					p: 0
				}}
			>
				<Avatar
					src={avatar}
					alt={firstLetter}
					sx={{
						height: 30,
						width: 30
					}}
				/>
			</IconButton>
			<Menu open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
				<MenuItem onClick={() => setShowInfoDialog(true)} disabled={false}>
					<ListItemIcon>
						<HelpCenterTwoTone />
					</ListItemIcon>
					Information
				</MenuItem>
				<MenuItem onClick={resetRootFolder} disabled={false}>
					<ListItemIcon>
						<FolderDeleteTwoTone />
					</ListItemIcon>
					Wurzelordner zurücksetzen
				</MenuItem>
				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<LogoutTwoTone />
					</ListItemIcon>
					Abmelden
				</MenuItem>
			</Menu>
			<InformationDialog open={showInfoDialog} onClose={() => setShowInfoDialog(false)} />
		</>
	);
}
