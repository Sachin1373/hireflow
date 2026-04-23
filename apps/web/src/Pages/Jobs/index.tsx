import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchBar from "@/Components/SearchBar";
import CustomTable from "@/Components/CustomTable";
import ActionMenu from "@/Components/ActionMenu";
import api from "@/axiosInstance";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function JobsPage() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const limit = 10;

  const canWrite =
    currentUser?.role === "ADMIN" ||
    (currentUser?.role === "HR" && currentUser.permissions?.write);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/jobs/list?page=${page}&limit=${limit}&search=${searchQuery}`);
      setJobs(res.data.data);
      if (res.data.pagination) {
        setTotal(res.data.pagination.total);
      }
    } catch (error) {
      console.error("Fetch jobs error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, searchQuery]);

  const handleCreateJob = () => {
    navigate('/dashboard/jobs/new')
  }

  const columns = [
    {
      field: "title",
      headerName: "Title",
      render: (row: any) => (
        <Typography variant="body2" sx={{ fontWeight: "600" }}>
          {row.title}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      render: (row: any) => (
        <Chip
          label={row.status || 'Draft'}
          size="small"
          sx={{
            borderRadius: "6px",
            bgcolor: row.status === 'active' ? 'success.main' : 'black',
            color: "white",
          }}
        />
      ),
    },
    {
      field: "created_at",
      headerName: "Created At",
      render: (row: any) => (
        <Typography variant="body2" color="text.secondary">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : ""}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "",
      align: "right" as const,
      render: (row: any) => (
        <ActionMenu
          actions={[
            {
              label: "Edit",
              icon: <EditIcon fontSize="small" />,
              onClick: () => {
                // To be implemented
              },
            },
            {
              label: "Delete",
              icon: <DeleteIcon fontSize="small" />,
              onClick: () => {
                 // To be implemented
              },
              color: "#d32f2f",
              dividerBefore: true,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Box>
      <Box className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Jobs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your job postings.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          {canWrite && (
            <>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateJob}
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                  bgcolor: "black",
                }}
              >
                Add Job
              </Button>
            </>
          )}
        </Stack>
      </Box>

      <Box className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex items-center justify-between">
        <Box sx={{ width: { xs: "100%", sm: 350 } }}>
          <SearchBar
            placeholder="Search by title"
            onChange={(val) => {
              setSearchQuery(val);
              setPage(1);
            }}
          />
        </Box>

        <Typography variant="caption" color="text.disabled">
          {searchQuery
            ? `Searching for "${searchQuery}"`
            : `Total: ${total} Jobs`}
        </Typography>
      </Box>

      <CustomTable
        columns={columns}
        rows={jobs}
        loading={loading}
        page={page}
        total={total}
        rowsPerPage={limit}
        onPageChange={setPage}
      />

    </Box>
  )
}
