import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';

export interface SortableTableProps {
	header: {
		title: string | JSX.Element;
		key: string;
		sortable?: boolean;
		fixedWidth?: number | string;
		padding?: 'checkbox' | 'none' | 'normal';
		align?: 'right'
		stringify?: (value: any) => string | JSX.Element;
		generator?: (row: any) => string | JSX.Element;
		comparator?: (a: any, b: any) => number;
	}[];
	data: any[];
	onRowClick?: (row: any) => void;
	initialSortKey?: string;
	initialSortOrder?: 'desc' | 'asc';
	size?: 'small' | 'medium';
}

export default function SortableTable(props: SortableTableProps) {
	const theme = useTheme();
	const [data, setData] = useState<any[]>([]);
	const [{ sortKey, order }, setSortKey] = useState<{ sortKey?: string; order: 'desc' | 'asc' }>({ order: 'desc' });

	useEffect(() => {
		setData(props.data);
		if (props.initialSortKey)
			setSortKey(({ order }) => {
				return { sortKey: props.initialSortKey, order };
			});
	}, [props.data]);

	function sortFunction(a: any, b: any) {
		if (!sortKey) return 0;
		if (order == 'desc') b = [a, (a = b)][0];
		if (!a[sortKey]) return -1;
		if (!b[sortKey]) return 1;

		switch (typeof a[sortKey]) {
			case 'string':
				return a[sortKey].localeCompare(b[sortKey]);
			case 'number':
			case 'bigint':
			case 'boolean':
				return a[sortKey] - b[sortKey];
			case 'object':
				if (a[sortKey] instanceof Date) {
					return a[sortKey].getTime() - b[sortKey].getTime();
				}
			default:
				return a[sortKey] - b[sortKey];
		}
	}

	function onClickSortHeader(key: string) {
		return (event: React.MouseEvent) => {
			if (key == sortKey) {
				setSortKey(({ sortKey, order }) => {
					return { sortKey, order: order === 'asc' ? 'desc' : 'asc' };
				});
				return;
			}
			setSortKey({ sortKey: key, order: 'desc' });
		};
	}

	return (
		<Table size={props.size || 'medium'}>
			<TableHead>
				<TableRow>
					{props.header.map(({ title, key, align, sortable, fixedWidth, padding }) => {
						return (
							<TableCell
								padding={padding}
								key={key + 'header'}
								width={fixedWidth}
								align={align||'left'}
								sortDirection={sortKey == key ? order : undefined}>
								{sortable ? (
									<TableSortLabel
										onClick={onClickSortHeader(key)}
										active={sortKey == key}
										direction={sortKey == key ? order : 'asc'}>
										{title}
									</TableSortLabel>
								) : (
									title
								)}
							</TableCell>
						);
					})}
				</TableRow>
			</TableHead>
			<TableBody>
				{data.sort(sortFunction).map((row, index) => {
					return (
						<TableRow
							key={index}
							onClick={() => {
								if (props.onRowClick) props.onRowClick(row);
							}}
							sx={
								props.onRowClick && {
									'&:hover': {
										bgcolor: theme.palette.grey[100],
										cursor: 'pointer'
									}
								}
							}>
							{props.header.map(cell => {
								if (cell.generator) {
									return <TableCell key={cell.key + `${index}`}>{cell.generator(row)}</TableCell>;
								}
								return (
									<TableCell key={cell.key + `${index}`}>
										{cell.stringify ? cell.stringify(row[cell.key]) : row[cell.key]}
									</TableCell>
								);
							})}
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}