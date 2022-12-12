import {
	Box,
	Button,
	Chip,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	useTheme
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Record } from 'pocketbase';

import Icon from './Icon';
import ConnectDialog from './ConnectDialog';
import Sync from './SyncButton';

export default function SettingsTable({
	state,
	rootDir,
}: {
	state: Record | null;
	rootDir: Record | undefined;
}) {
	const theme = useTheme();
	const navigate = useNavigate();
	const [showConnectDialog, setShowConnectDialog] = useState(false);
	const [syncNow, setSyncNow] = useState(false)


	function handleClose(success?: boolean) {
		setShowConnectDialog(false);
		if(success) {
			setSyncNow(true)
		}
	}

	function onSyncFinished() {
		setSyncNow(false);
		navigate(0);
	}

	function onRootDirRemove() {
		
	}

	return (
		<>
			<TableContainer component={Paper}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>
								Expert-Giggle Einstellungen
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell width={200}>Wurzel-Ordner</TableCell>
							<TableCell>
								{rootDir == null ? (
									<Typography variant='body2' sx={{ fontStyle: 'italic' }}>
										nicht festgelegt
									</Typography>
								) : (
									<Chip
										label={rootDir?.name}
										variant='filled'
										color='primary'
										onClick={() => navigate(`/dir/${rootDir.id}`)}
										size='small'
									/>
								)}
							</TableCell>
							<TableCell>
								<Button
									variant='outlined'
									size='small'
									color='error'
									disabled={rootDir == null}
									onClick={onRootDirRemove}
									startIcon={<Icon size='xss' name='delete-bin' style='line' />}
									sx={{
										height: 32
									}}>
									Entfernen
								</Button>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width={150}>Coach</TableCell>
							<TableCell>
								{state == null ? (
									<Chip label='Nicht verbunden' variant='filled' color='error' size='small' />
								) : (
									<Chip label='Verbunden' variant='filled' color='success' size='small' />
								)}
							</TableCell>
							<TableCell>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row'
									}}>
									<Button
										variant='contained'
										size='small'
										disabled={state != null}
										startIcon={<Icon size='xss' name='link' />}
										onClick={() => setShowConnectDialog(true)}
										sx={{
											height: 32,
											mr: theme.spacing(1)
										}}>
										Verbinden
									</Button>
									<Sync callback={onSyncFinished} syncNow={syncNow}/>
								</Box>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<ConnectDialog open={showConnectDialog} onClose={handleClose} />
		</>
	);
}
