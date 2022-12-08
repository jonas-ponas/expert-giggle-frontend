import { Alert, AlertTitle } from '@mui/material';
import { ClientResponseError } from 'pocketbase';
import React from 'react';
import { useRouteError } from 'react-router-dom';
import Icon from './Icon';

export default function Error({ title, description }: { title: string; description: string }) {
	const error = useRouteError()
	return (
		<Alert variant='filled' severity='error' icon={<Icon name='error-warning' style='line' />}>
			<AlertTitle>{title}</AlertTitle>
			{error?.message||"undefined"}
		</Alert>
	);
}
