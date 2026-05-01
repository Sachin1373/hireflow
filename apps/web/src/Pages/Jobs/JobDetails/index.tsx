import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Chip, Divider, Stack, Typography } from "@mui/material";
import api from "@/axiosInstance";
import CustomTable from "@/Components/CustomTable";
import { useParams } from "react-router-dom";

type Reviewer = {
  id: string;
  name: string;
  email: string;
  designation?: string;
  created_at?: string;
};

const REVIEWERS_PER_PAGE = 5;

const JobDetails = () => {
  const [page, setPage] = useState(1);
  const { jobId } = useParams();

  console.log("id :", jobId);
  const [loadingJob, setLoadingJob] = useState(!!jobId);

  const [formData, setFormData] = useState({
    meta: {} as any,
    reviewers: [] as any[],
  });

  console.log("form data :", formData);
  useEffect(() => {
    if (jobId) {
      api
        .get(`/jobs/${jobId}`)
        .then((res) => {
          const job = res.data.data;
          setFormData({
            meta: {
              title: job.title,
              description: job.description,
              expire_at: job.form_expires_at,
              jd_content: job.jd_content,
            },
            reviewers: job.reviewers || [],
          });
        })
        .catch((err) => console.error("Error fetching job details:", err))
        .finally(() => setLoadingJob(false));
    } else {
      setLoadingJob(false);
    }
  }, [jobId]);

  const paginatedReviewers = useMemo(() => {
    const start = (page - 1) * REVIEWERS_PER_PAGE;
    return formData.reviewers.slice(start, start + REVIEWERS_PER_PAGE);
  }, [page, formData.reviewers]);

  const reviewerColumns = [
    {
      field: "name",
      headerName: "Reviewer",
      render: (row: Reviewer) => (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar
            sx={{ width: 34, height: 34, bgcolor: "black", fontWeight: 600 }}
          >
            {(row.name || "R").charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>{row.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {row.designation || "-"}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      render: (row: Reviewer) => (
        <Typography variant="body2" color="text.secondary">
          {row.email}
        </Typography>
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxHeight: "88vh",
        overflowY: "auto",
        pr: 1,
      }}
    >
      <Box className="bg-white p-5 rounded-xl border border-gray-200">
        <Box className='flex justify-between'>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Job Details
          </Typography>
          <Chip sx={{ background: 'red' }}
            label={
              formData.meta.expire_at
                ? new Date(formData.meta.expire_at).toLocaleDateString()
                : "No expiry date"
            }
          />
        </Box>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Title
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {formData.meta?.title || "-"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Short Description
            </Typography>
            <Typography color="text.secondary">
              {formData.meta?.description || "-"}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box className="bg-white p-5 rounded-xl border border-gray-200">
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Assigned Reviewers
        </Typography>
        <CustomTable
          columns={reviewerColumns}
          rows={paginatedReviewers}
          loading={false}
          page={page}
          total={formData.reviewers.length}
          rowsPerPage={REVIEWERS_PER_PAGE}
          onPageChange={setPage}
        />
      </Box>

      <Box className="bg-white p-5 rounded-xl border border-gray-200">
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Job Description
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{ color: "text.secondary" }}
          dangerouslySetInnerHTML={{
            __html: formData.meta?.jd_content || "<p>-</p>",
          }}
        />
      </Box>
    </Box>
  );
};

export default JobDetails;
