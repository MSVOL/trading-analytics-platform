import React from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Paper,
    TablePagination,
    TableSortLabel
} from '@mui/material';
import { Order, Column } from '../../types/components';

interface DataGridProps<T> {
    data: T[];
    columns: Column[];
    sortable?: boolean;
    defaultSort?: keyof T;
    defaultOrder?: Order;
    pageSize?: number;
}

export function DataGrid<T extends { id: string }>({ 
    data,
    columns,
    sortable = true,
    defaultSort,
    defaultOrder = 'asc',
    pageSize = 10
}: DataGridProps<T>) {
    const [order, setOrder] = React.useState<Order>(defaultOrder);
    const [orderBy, setOrderBy] = React.useState<keyof T | undefined>(defaultSort);
    const [page, setPage] = React.useState(0);

    const handleSort = (property: keyof T) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedData = React.useMemo(() => {
        if (!orderBy) return data;
        
        return [...data].sort((a, b) => {
            const aValue = a[orderBy];
            const bValue = b[orderBy];
            
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            }
            
            return order === 'asc' 
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });
    }, [data, order, orderBy]);

    return (
        <Paper elevation={2}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.field}
                                    align={column.numeric ? 'right' : 'left'}
                                    sortDirection={orderBy === column.field ? order : false}
                                >
                                    {sortable ? (
                                        <TableSortLabel
                                            active={orderBy === column.field}
                                            direction={orderBy === column.field ? order : 'asc'}
                                            onClick={() => handleSort(column.field as keyof T)}
                                        >
                                            {column.headerName}
                                        </TableSortLabel>
                                    ) : (
                                        column.headerName
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData
                            .slice(page * pageSize, page * pageSize + pageSize)
                            .map((row) => (
                                <TableRow key={row.id}>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={`${row.id}-${column.field}`}
                                            align={column.numeric ? 'right' : 'left'}
                                        >
                                            {column.valueFormatter 
                                                ? column.valueFormatter(row[column.field])
                                                : row[column.field]}
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
}
