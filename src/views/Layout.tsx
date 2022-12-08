import { Avatar, Box, Grid, Link, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

import 'remixicon/fonts/remixicon.css'
import Brandbar from '../components/Brandbar';
import Icon from '../components/Icon';
import Navigation from '../components/Navigation';

export default function Layout(props: {}) {
	const theme = useTheme();

    const contentHeight = `calc(100vh - 55px - ${theme.spacing(0.5)})` // FIXME
	return (
		<Box>
			<Brandbar />
			<Grid container sx={{
                bgcolor: theme.palette.grey[50],
                height: contentHeight,
                overflowX: 'hidden'
            }}>
                <Grid item lg={2}>
                    <Navigation />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: theme.spacing(2),
                    }}>
                        <Link variant='body2' sx={{
                            color: theme.palette.grey[500],
                            textDecorationColor: theme.palette.grey[500]
                        }} href='https://github.com/jonas-ponas/expert-giggle-frontend/' target='_blank'>
                        Report a Bug
                        </Link>
                        <Typography variant='body2' sx={{
                            color: theme.palette.grey[300]
                        }}>
                            © Jonas Heilemann
                        </Typography>
                    </Box>
                </Grid>
                <Grid item lg={10}>
                <Outlet />
                </Grid>
            </Grid>
		</Box>
	);
}
