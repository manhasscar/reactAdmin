import { DataGrid } from '@mui/x-data-grid';
import { Box, Paper, Typography } from '@mui/material';

const CustomDataGrid = ({
    rows = [],
    columns = [],
    paginationModel,
    onPaginationModelChange,
    pageSizeOptions = [20, 50, 100],
    loading = false,
    error = null,
    onRowClick,
    checkboxSelection = false,
    disableSelectionOnClick = true,
    ...props
}) => {
    return (
        // <Paper sx={{ 
        //     height: '100%',
        //     width: '100%',
        //     display: 'flex',
        //     flexDirection: 'column',
        //     p: 2,
        // }}>
            <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={onPaginationModelChange}
                    pageSizeOptions={pageSizeOptions}
                    loading={loading}
                    error={error}
                    onRowClick={onRowClick}
                    checkboxSelection={checkboxSelection}
                    disableSelectionOnClick={disableSelectionOnClick}
                    slotProps={{
                        loadingOverlay: {
                            variant: 'linear-progress',
                            noRowsVariant: 'skeleton'
                        }
                    }}
                    slots={{
                        noRowsOverlay: () => (
                            <Box sx={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography variant="body1" color="text.secondary">
                                    조회된 데이터가 없습니다.
                                </Typography>
                            </Box>
                        )
                    }}
                    sx={{
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-row': {
                            cursor: onRowClick ? 'pointer' : 'default',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                        },
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'white',
                        ...props.sx
                    }}
                    {...props}
                />
            </Box>
        // {/* </Paper> */}
    );
};

export default CustomDataGrid; 