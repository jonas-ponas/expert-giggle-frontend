import { Box, useTheme, Icon as MuiIcon, Link, Paper } from '@mui/material'
import React from 'react'
import { useLoaderData } from 'react-router-dom'
import Icon from '../components/Icon'
import SortableTable from '../components/SortableTable'
import { iconMapping } from '../icons/icons'
import { FileRecord } from '../records'
import { usePocketbase } from '../util/PocketbaseContext'
import verbalizeDate from '../util/verbalizeDate'
import verbalizeFileSize from '../util/verbalizeFileSize'

export default function Search(props: {}) {
    const theme = useTheme()
    const loaderData = useLoaderData() as FileRecord[]
    const client = usePocketbase()

    const tableHeaders = [
		{
			title: '',
			key: 'icon',
			padding: 'checkbox',
			generator: (row: any) => {
				const icon = iconMapping[row.mime || ''];
					if (icon) {
						return (
							<MuiIcon sx={{ fontSize: '1.5em ' }}>
								<img src={icon} />
							</MuiIcon>
						);
					}
					return <Icon name='file' style='line' size='xl' />;
			}
		},
		{
			title: 'Name',
			key: 'name',
			sortable: true,
			generator(row: any) {
                const url = `https://coach.ponas.dev/api/files/${row.collectionId}/${row.id}/${row.fileName}`;
				return (
                    <Link
                        href={url}
                        target='_blank'
                        sx={{
                            color: theme.palette.text.primary,
                            textDecorationColor: theme.palette.text.primary
                        }}>
                        {row.name}
                    </Link>
                );
			}
		},
		{
			title: 'Größe',
			key: 'size',
			sortable: true,
			stringify(value: number) {
				if (!value) return '';
				return verbalizeFileSize(value);
			}
		},
		{
			title: 'Geändert',
			key: 'timestamp',
			sortable: true,
			stringify(value: string) {
				return verbalizeDate(new Date(value));
			}
		},
	];

    return (
        <Box component={Paper}>
            <SortableTable header={tableHeaders} data={loaderData.items}/>
        </Box>
    )
}