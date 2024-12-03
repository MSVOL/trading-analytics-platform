import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Paper,
    Box
} from '@mui/material';

interface Column {
    id: string;
    label: string;
    numeric?: boolean;
    format?: (value: any) => string;
    width?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column[];
    defaultSort?: string;
    defaultOrder?: 'asc' | 'desc';
    pageSize?: number;
}

export const DataTable = <T extends Record<string, any>>({
    data,
    columns,
    defaultSort,
    defaultOrder = 'asc',
    pageSize = 10
}: DataTableProps<T>) => {
    const [page, setPage] = React.useState(0);
    const [orderBy, setOrderBy] = React.useState<string>(defaultSort || columns[0].id);
    const [order, setOrder] = React.useState<'asc' | 'desc'>(defaultOrder);

    const handleSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedData = React.useMemo(() => {
        return [...data].sort((a, b) => {
            if (order === 'asc') {
                return a[orderBy] < b[orderBy] ? -1 : 1;
            } else {
                return b[orderBy] < a[orderBy] ? -1 : 1;
            }
        });
    }, [data, order, orderBy]);

    return (
        <Paper elevation={2}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell
                                    key={column.id}
                                    align={column.numeric ? 'right' : 'left'}
                                    style={{ width: column.width }}
                                >
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={orderBy === column.id ? order : 'asc'}
                                        onClick={() => handleSort(column.id)}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData
                            .slice(page * pageSize, page * pageSize + pageSize)
                            .map((row, index) => (
                                <TableRow key={index}>
                                    {columns.map(column => (
                                        <TableCell
                                            key={column.id}
                                            align={column.numeric ? 'right' : 'left'}
                                        >
                                            {column.format 
                                                ? column.format(row[column.id])
                                                : row[column.id]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={pageSize}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
            />
        </Paper>
    );
};
