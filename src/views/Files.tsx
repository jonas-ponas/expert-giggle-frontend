import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import DirectoryTable from '../components/DirectoryTable';
import { DirectoryRecord } from '../records';
import { Record } from 'pocketbase';
import Sync from '../components/Sync';

export default function Files(props: {}) {
    const theme = useTheme()
	const loaderData = useLoaderData();
	return (
		<Box>
			<Box>
				<Sync />
			</Box>
			<Box sx={{
                mt: theme.spacing(1)
            }}>
            <DirectoryTable record={loaderData as Record} />
            </Box>
		</Box>
	);
}
