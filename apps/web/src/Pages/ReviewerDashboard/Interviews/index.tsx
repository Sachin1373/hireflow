import { useEffect, useState } from "react";
import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import SearchBar from "@/Components/SearchBar";
import CustomTable from "@/Components/CustomTable";
import api from "@/axiosInstance";
import { toast } from "react-toastify";

type InterviewRow = {
  interview_id: string;
  application_id: string;
  candidate_name: string;
  candidate_email: string;
  resume_url: string;
  job_title: string;
  interview_status: string;
  created_at: string;
};

export default function Interview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [interviews, setInterviews] = useState<InterviewRow[]>([]);

  const limit = 10;

  const fetchInterviews = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/reviewer/assigned-interviews?page=${page}&limit=${limit}&search=${searchQuery}`,
      );

      setInterviews(res.data.interviews);
      setTotal(res.data.total);
    } catch (error) {
      console.error(error);

      toast.error("Failed to fetch interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [page, searchQuery]);

  const handleAction = async (id: string, action: string) => {
    console.log('status :', action)
    try {
      await api.patch(`/reviewer/interviews/${id}/status`, {
        status: action,
      });

      toast.success(`Candidate ${action.toLowerCase()} successfully`);

      fetchInterviews();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update interview status");
    }
  };

  const columns = [
    {
      field: "candidate_name",
      headerName: "Candidate",
      render: (row: InterviewRow) => (
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
            }}
          >
            {row.candidate_name}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {row.candidate_email}
          </Typography>
        </Box>
      ),
    },

    {
      field: "job_title",
      headerName: "Job",
      render: (row: InterviewRow) => (
        <Typography variant="body2">{row.job_title}</Typography>
      ),
    },

    {
      field: "interview_status",
      headerName: "Status",
      render: (row: InterviewRow) => (
        <Chip
          label={row.interview_status}
          size="small"
          sx={{
            borderRadius: "6px",
          }}
        />
      ),
    },

    {
      field: "created_at",
      headerName: "Created At",
      render: (row: InterviewRow) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(row.created_at).toLocaleDateString()}
        </Typography>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      align: "center" as const,
      render: (row: InterviewRow) => {
        if (row.interview_status === "SELECTED" || row.interview_status === "REJECTED") {
          return (
            <Chip
              label={row.interview_status}
              size="small"
              color={row.interview_status === "SELECTED" ? "success" : "error"}
            />
          );
        }
        return (
            <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
          }}
        >
          <Tooltip title="Select">
            <IconButton
              color="success"
              onClick={() => handleAction(row.interview_id, "SELECTED")}
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reject">
            <IconButton
              color="error"
              onClick={() => handleAction(row.interview_id, "REJECTED")}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </Box>
        )
      },
    },
  ];

  return (
    <Box>
      <Box className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Box>
          <Typography
            variant="h4"
            sx={{
              mb: 1,
              fontWeight: 700,
            }}
          >
            Interviews
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Manage assigned interviews.
          </Typography>
        </Box>
      </Box>

      <Box className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex items-center justify-between">
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: 350,
            },
          }}
        >
          <SearchBar
            placeholder="Search candidate or job"
            onChange={(val) => {
              setSearchQuery(val);
              setPage(1);
            }}
          />
        </Box>

        <Typography variant="caption" color="text.disabled">
          {searchQuery
            ? `Searching for "${searchQuery}"`
            : `Total: ${total} Interviews`}
        </Typography>
      </Box>

      <CustomTable
        columns={columns}
        rows={interviews}
        loading={loading}
        page={page}
        total={total}
        rowsPerPage={limit}
        onPageChange={setPage}
      />
    </Box>
  );
}
