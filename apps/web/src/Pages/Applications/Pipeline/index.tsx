import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/axiosInstance";
import {
  Box,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import ApplicationColumn from "./ApplicationColumn";
import { toast } from "react-toastify";

type JobMetaData = {
  title: string;
  desc: string;
  status: string;
  review_expires_at: string;
};

export default function Pipeline() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [JobMetaData, setJobMetaData] = useState<JobMetaData>({
    title: "",
    desc: "",
    status: "",
    review_expires_at: "",
  });

  const isReviewActive =
    JobMetaData.review_expires_at &&
    new Date(JobMetaData.review_expires_at) > new Date();

  const fetchJobMetaData = async () => {
    try {
      const res = await api.get(`/jobs/${jobId}`);

      setJobMetaData({
        title: res.data.data.title,
        desc: res.data.data.description,
        status: res.data.data.status,
        review_expires_at: res.data.data.review_expires_at,
      });
    } catch (error) {
      console.error("Failed to fetch job metadata", error);
    }
  };

  const handleComplete = async() => {
    try {
       await api.patch(`/jobs/${jobId}/complete`);
       toast.success("Job completed successfully");

      navigate("/dashboard/jobs")
    } catch (error) {
      console.error(error);
       toast.error("Failed to complete job");
    }
  }

  useEffect(() => {
    if (jobId) {
      fetchJobMetaData();
    }
  }, [jobId]);

  return (
    <Box>
      <Box className="flex items-center justify-between" sx={{ mb: 4 }}>
        <Box className="flex gap-3 items-center justify">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            {JobMetaData.title}
          </Typography>
          <Chip
            label={JobMetaData.status}
            size="small"
            sx={{
              bgcolor: "black",
              color: "white",
            }}
          />
        </Box>

        <Box className="flex items-center gap-2">
          <Chip
            label={`Review Ends: ${
              JobMetaData.review_expires_at
                ? new Date(JobMetaData.review_expires_at).toLocaleDateString()
                : "-"
            }`}
          />
          <Button disabled={isReviewActive} onClick={handleComplete} variant="contained">
            Complete
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
          height: "75vh",
        }}
      >
        <ApplicationColumn
          title="Shortlisted"
          jobId={jobId}
          status="SHORTLISTED"
        />
        <ApplicationColumn title="Interview" jobId={jobId} status="INTERVIEW" />
        <ApplicationColumn title="Hired" jobId={jobId} status="HIRED" />
        <ApplicationColumn title="Rejected" jobId={jobId} status="REJECTED" />
      </Box>
    </Box>
  );
}
