import * as React from 'react';
import { Record } from 'pocketbase';
import {
	Icon as MuiIcon,
	IconButton,
	Link,
	ListItemIcon,
	Menu,
	MenuItem,
	TableCell,
	TableRow,
	useTheme
} from '@mui/material';
import verbalizeFileSize from '../util/verbalizeFileSize';
import verbalizeDate from '../util/verbalizeDate';
import { InsertDriveFileTwoTone, MoreVert, StarTwoTone } from '@mui/icons-material';
// File Icons
import icons from '../icons/icons';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

const iconMapping: { [key: string]: string | undefined } = {
	pdf: icons.pdf,
	png: icons.img,
	jpg: icons.img,
	jpeg: icons.img,
	gif: icons.img,
	rkt: icons.rkt,
	java: icons.java,
	py: icons.py,
	zip: icons.zip,
	pptx: icons.ppt,
	doc: icons.doc,
	docx: icons.doc,
	mp4: icons.video,
	mov: icons.video
};

export default function FileItemRow({ record }: { record: Record }) {
	const theme = useTheme();
	const url = `https://coach.ponas.dev/api/files/${record.collectionId}/${record.id}/${record.cachedFile}`;

	const fileExtension = record.name.split('.').at(-1);
	const icon = iconMapping[fileExtension];

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<TableRow
			sx={{
				'&:hover': {
					bgcolor: theme.palette.grey[100],
					cursor: 'pointer'
				}
			}}
			onDoubleClick={() => window.open(url, '_blank')}>
			<TableCell>
				{(icon && (
					<MuiIcon>
						<img src={icon} />
					</MuiIcon>
				)) || <Icon name='file' style='line' size='xl' />}
			</TableCell>
			<TableCell>
				<Link
					href={url}
					target='_blank'
					sx={{
						color: theme.palette.common.black,
						textDecorationColor: theme.palette.grey[500]
					}}>
					{record.name}
				</Link>
			</TableCell>
			<TableCell>{verbalizeFileSize(record.size)}</TableCell>
			<TableCell>{verbalizeDate(record.timestamp)}</TableCell>
			<TableCell>
				<IconButton id='basic-button' onClick={handleClick}>
					<Icon name='more-2' style='line' />
				</IconButton>
			</TableCell>
			<Menu
				id='basic-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button'
				}}>
				<MenuItem onClick={handleClose} disabled={true}>
					<ListItemIcon>
						<Icon name='star' style='line' size='lg' />
					</ListItemIcon>
					Favorit
				</MenuItem>
			</Menu>
		</TableRow>
	);
}
