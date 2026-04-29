import { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/Components/SearchBar";
import CustomTable from "@/Components/CustomTable";
import api from "@/axiosInstance";

type JobRow = {
  id: string;
  title: string;
  status?: string;
  created_at?: string;
};

export default function ReviewerApplicationsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const limit = 10;

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/reviewer/assigned-jobs?page=${page}&limit=${limit}&search=${searchQuery}`,
      );
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

  const columns = [
    {
      field: "title",
      headerName: "Title",
      render: (row: JobRow) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: "600",
            cursor:
              row.status === "draft" || !row.status ? "pointer" : "default",

            color:
              row.status === "draft" || !row.status
                ? "primary.main"
                : "inherit",
          }}
          onClick={() => {
            if (row.status === "draft" || !row.status) {
              navigate(`/dashboard/jobs/new?jobId=${row.id}`);
            }
          }}
        >
          {row.title}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      render: (row: JobRow) => (
        <Chip
          label={row.status || "Draft"}
          size="small"
          sx={{
            borderRadius: "6px",
            bgcolor: row.status === "active" ? "success.main" : "black",
            color: "white",
          }}
        />
      ),
    },

    {
      field: "created_at",
      headerName: "Created At",
      render: (row: JobRow) => (
        <Typography variant="body2" color="text.secondary">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : ""}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      align: "center" as const,
      render: (row: JobRow) => (
        <Typography
          variant="body2"
          color="text.secondary"
          onClick={() => navigate(`/reviewer-dashboard/application/${row.id}`)}
          sx={{
            color: "primary.main",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "underline",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          Review Applications
        </Typography>
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
            Review Job Applications.
          </Typography>
        </Box>
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
  );
}
