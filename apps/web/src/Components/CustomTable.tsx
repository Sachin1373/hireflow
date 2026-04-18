import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  TablePagination,
} from "@mui/material";

type Column = {
  field: string;
  headerName: string;
  align?: "left" | "right" | "center";
  render?: (row: any) => React.ReactNode;
};

type Props = {
  columns: Column[];
  rows: any[];
  loading?: boolean;
  page: number;
  total: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
};

const CustomTable = ({
  columns,
  rows,
  loading = false,
  page,
  total,
  rowsPerPage,
  onPageChange,
}: Props) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        borderRadius: "16px", 
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        backgroundColor: "background.default"
      }}
    >
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell 
                  key={col.field}
                  align={col.align || "left"}
                  sx={{
                    backgroundColor: "background.paper",
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    py: 2,
                    borderBottom: "2px solid",
                    borderColor: "divider"
                  }}
                >
                  {col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                    <CircularProgress size={32} thickness={4} sx={{ color: "black" }} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: '500' }}>
                      No results found
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      Try adjusting your search or filters
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <TableRow 
                  key={row.id || i} 
                  hover
                  sx={{ 
                    "&:last-child td, &:last-child th": { border: 0 },
                    transition: "background-color 0.2s ease",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.02) !important" }
                  }}
                >
                  {columns.map((col) => (
                    <TableCell 
                        key={col.field}
                        align={col.align || "left"}
                        sx={{ py: 2.5, borderBottom: "1px solid", borderColor: "grey.100" }}
                    >
                      {col.render
                        ? col.render(row)
                        : (
                          <Typography variant="body2" color="text.primary">
                            {row[col.field] || "-"}
                          </Typography>
                        )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ borderTop: "1px solid", borderColor: "divider", px: 2 }}>
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
          sx={{
            "& .MuiTablePagination-toolbar": { minHeight: 64 },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input": { display: "none" }
          }}
        />
      </Box>
    </Paper>
  );
};

export default CustomTable;