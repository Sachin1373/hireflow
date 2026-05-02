import {
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";

import { useParams } from "react-router-dom";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import CustomTable from "@/Components/CustomTable";
import { useEffect, useState } from "react";
import api from "@/axiosInstance";
import CollapsibleJD from "@/Components/CollapsibleJD";

type JobMetaData = {
  title: string;
  desc: string;
  status: string;
  review_expires_at: string;
  jd_content: string;
};

type Application = {
  id: string;
  name: string;
  email: string;
  resume_url: string;
  status: string;
};

const ReviewApplications = () => {
  const { jobId } = useParams();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 5;

  const [JobMetaData, setJobMetaData] = useState<JobMetaData>({
    title: "",
    desc: "",
    status: "",
    review_expires_at: "",
    jd_content: "",
  });

  const fetchJobMetaData = async () => {
    try {
      const res = await api.get(`/jobs/${jobId}`);

      setJobMetaData({
        title: res.data.data.title,
        desc: res.data.data.description,
        status: res.data.data.status,
        review_expires_at: res.data.data.review_expires_at,
        jd_content: res.data.data.jd_content,
      });
    } catch (error) {
      console.error("Failed to fetch job metadata", error);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/reviewer/assigned-applications/${jobId}?page=${page}&limit=${limit}`,
      );

      setApplications(res.data.data || []);
      setTotal(res.data.pagination.total || 0);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    applicationId: string,
    status: "SELECTED" | "REJECTED",
  ) => {
    try {
      await api.patch(`/reviewer/applications/${applicationId}/status`, {
        status,
      });

      fetchApplications();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchJobMetaData();
      fetchApplications();
    }
  }, [jobId, page]);

  const columns = [
    {
      field: "candidate",
      headerName: "Candidate",
      render: (row: Application) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "black",
            }}
          >
            {row.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
              }}
            >
              {row.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Stack>
      ),
    },

    {
      field: "resume",
      headerName: "Resume",
      render: (row: Application) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<VisibilityIcon />}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
          }}
          onClick={() =>
            window.open(
              `http://localhost:3001${row.resume_url}`,
              "_blank",
              "width=900,height=700",
            )
          }
        >
          View Resume
        </Button>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      render: (row: Application) => (
        <Chip
          label={row.status}
          size="small"
          sx={{
            bgcolor: "#f3f4f6",
          }}
        />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      render: (row: Application) => {
        if (row.status === "SELECTED" || row.status === "REJECTED") {
          return (
            <Chip
              label={row.status}
              size="small"
              color={row.status === "SELECTED" ? "success" : "error"}
            />
          );
        }
        return (
          <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => updateStatus(row.id, "SELECTED")}
            sx={{
              bgcolor: "#ecfdf3",
              "&:hover": {
                bgcolor: "#d1fadf",
              },
            }}
          >
            <CheckCircleIcon color="success" />
          </IconButton>

          <IconButton
            onClick={() => updateStatus(row.id, "REJECTED")}
            sx={{
              bgcolor: "#fef3f2",
              "&:hover": {
                bgcolor: "#fee4e2",
              },
            }}
          >
            <CancelIcon color="error" />
          </IconButton>
        </Stack>
        )
      },
    },
  ];

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          {JobMetaData.title}
        </Typography>

        <Typography color="text.secondary">{JobMetaData.desc}</Typography>
      </Box>

      {/* META */}

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Chip
          label={JobMetaData.status}
          sx={{
            bgcolor: "black",
            color: "white",
          }}
        />

        <Chip
          label={`Review Ends: ${
            JobMetaData.review_expires_at
              ? new Date(JobMetaData.review_expires_at).toLocaleDateString()
              : "-"
          }`}
        />
      </Stack>

      {/* JD */}

      <CollapsibleJD jdContent={JobMetaData.jd_content} />

      {/* TABLE */}

      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
          }}
        >
          Assigned Applications
        </Typography>

        <CustomTable
          columns={columns}
          rows={applications}
          loading={loading}
          page={page}
          total={total}
          rowsPerPage={limit}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </Box>
    </Box>
  );
};

export default ReviewApplications;
