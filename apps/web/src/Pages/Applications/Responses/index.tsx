import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import SearchBar from "@/Components/SearchBar";
import CustomTable from "@/Components/CustomTable";
import api from "@/axiosInstance";

type ApplicationRow = {
  id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string;
  status: string;
  created_at: string;
  assigned_reviewer_count?: number;
};

type JobDetails = {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
};

export const Responses = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  console.log('job :', job)
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 10;

  const fetchData = async () => {
    try {
      setLoading(true);

      const [jobRes, appRes] =
        await Promise.all([
          api.get(`/jobs/${jobId}/metedata`),

          api.get(
            `/applications/job/${jobId}/fetchAll`,
            {
              params: {
                page,
                limit,
                search: searchQuery,
              },
            }
          ),
        ]);
      setJob(jobRes.data.data);

      setApplications(appRes.data.data);

      setTotal(
        appRes.data.pagination?.total || 0
      );
    } catch (error) {
      console.error(
        "Failed to fetch responses",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jobId, page, searchQuery]);

  const columns = [
    {
      field: "candidate",
      headerName: "Candidate",
      render: (row: ApplicationRow) => (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Avatar
            sx={{
              bgcolor: "black",
              fontWeight: 600,
            }}
          >
            {row.candidate_name
              ?.charAt(0)
              ?.toUpperCase()}
          </Avatar>

          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
              }}
            >
              {row.candidate_name}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {row.candidate_email}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      render: (row: ApplicationRow) => (
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {row.candidate_phone || "-"}
        </Typography>
      ),
    },
    {
      field: "reviewers",
      headerName: "Reviewers",
      render: (row: ApplicationRow) => (
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {row.assigned_reviewer_count || 0}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      render: (row: ApplicationRow) => (
        <Chip
          label={row.status}
          size="small"
          sx={{
            borderRadius: "6px",
            textTransform:
              "capitalize",
            bgcolor:
              row.status ===
              "reviewed"
                ? "success.main"
                : row.status ===
                    "assigned"
                  ? "warning.main"
                  : "black",

            color: "white",
          }}
        />
      ),
    },
    {
      field: "created_at",
      headerName: "Applied At",
      render: (row: ApplicationRow) => (
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {new Date(
            row.created_at
          ).toLocaleDateString()}
        </Typography>
      ),
    },
  ];

  if (loading && !job) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          {job?.title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: "900px",
            lineHeight: 1.7,
          }}
        >
          {job?.description}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Chip
            label={
              job?.status || "draft"
            }
            size="small"
            sx={{
              bgcolor:
                job?.status ===
                "active"
                  ? "success.main"
                  : "black",

              color: "white",
              textTransform:
                "capitalize",
            }}
          />

          <Chip
            label={`${total} Applications`}
            size="small"
            variant="outlined"
          />
        </Stack>
      </Box>

      <Box
        className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex items-center justify-between"
      >
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: 350,
            },
          }}
        >
          <SearchBar
            placeholder="Search candidate"
            onChange={(val) => {
              setSearchQuery(val);
              setPage(1);
            }}
          />
        </Box>

        <Typography
          variant="caption"
          color="text.disabled"
        >
          {searchQuery
            ? `Searching for "${searchQuery}"`
            : `Total: ${total} Applications`}
        </Typography>
      </Box>

      <CustomTable
        columns={columns}
        rows={applications}
        loading={loading}
        page={page}
        total={total}
        rowsPerPage={limit}
        onPageChange={setPage}
      />
    </Box>
  );
};