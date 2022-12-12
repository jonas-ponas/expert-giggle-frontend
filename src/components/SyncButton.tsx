import { Box, Button, CircularProgress, Paper, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { usePocketbase } from '../util/PocketbaseContext';
import Icon from './Icon';

const messages = {
	connect: 'Verbinde mit Update-Service...',
	auth: 'Authenifiziere bei Update-Service...',
	state: 'Rufe aktuellen Zustand ab...',
	coach: [
		'Rufe Coach Daten ab... (1/4)',
		'Rufe Coach Daten ab... (2/4',
		'Rufe Coach Daten ab... (3/4)',
		'Rufe Coach Daten ab... (4/4)'
	],
	database: [
		'Synchronisiere Ordner mit Datenbank...',
		'Synchronisiere Dateien mit Datenbank...',
		'Synchronisiere Cache-Dateien mit Datenbank...'
	],
    done: 'Fertig!'
};

type phases = 'connect' | 'state' | 'auth' | 'coach' | 'database' | 'done'

export default function Sync(props: {syncNow?: boolean, callback?: ()=>void}) {
    const theme = useTheme()
    const client = usePocketbase()

    const [isSyncing, setIsSyncing] = useState(false)
    const [phase, setPhase] = useState<phases>('connect')
    const [step, setStep] = useState<number>(0)
    const [progress, setProgress] = useState<number>(0)
    const [error, setError] = useState<undefined|string>(undefined)

	useEffect(() => {
		if(props.syncNow) {
			handleSync()
		}
	}, [props.syncNow])

    function handleSync() {
        setPhase('connect')
        setIsSyncing(true)
        if (!client?.authStore.isValid) {
            setError('Konnte nicht beim Sync-Service anmelden. Versuchen Sie sich neueinzuloggen!')
        }
		const ws = new WebSocket('wss://coach.ponas.dev/ws');
		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					type: 'login',
					userId: client?.authStore.model?.id,
					token: client?.authStore.token
				})
			);
		};

		ws.onmessage = event => {
			const json = JSON.parse(event.data);
			switch (json.type) {
				case 'login':
					ws.send(
						JSON.stringify({
							type: 'sync'
						})
					);
					break;
				case 'progress':
					if (json.phase == 'done') {
						setProgress(100);
                        setPhase('done')
						setTimeout(() => {
                            setIsSyncing(false)
							if(props.callback) props.callback()
                        }, 1000);
						return;
					}
					setPhase(json.phase);
					setStep(json?.step || 0);
					setProgress(Math.floor(((json?.detail || 0) / (json?.total || 1)) * 100));
					break;
				case 'error':
                    setError(json.msg);
                    setIsSyncing(false);
					break;
				default:
					console.log('Unknown Data', json);
			}
		};
    }


	return (
		<Box sx={{
            display: 'flex',
            alignItems: 'center'
        }}>
			<Button variant='outlined' size='small' onClick={handleSync} sx={{
                height: 32
            }} startIcon={
                isSyncing ? <CircularProgress size={18} variant='indeterminate' /> : <Icon name='refresh' style='line' size='sm'/>
            }>
				Synchronisieren
			</Button>
            { isSyncing && (
                <Typography variant="body2" sx={{ml: theme.spacing(1), color: theme.palette.grey[500]}}>
                    {['database', 'coach'].includes(phase) ? messages[phase][step - 1] : messages[phase]}
                    {phase == 'database' ? ` ${progress}%` : ''}
                </Typography>
            )}
		</Box>
	);
}
