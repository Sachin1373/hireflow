import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import api from "@/axiosInstance";

type Job = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  description?: string;
};

export default function Applications() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await api.get("/jobs/list");

      setJobs(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Applications
        </Typography>

        <Typography color="text.secondary">
          View applications received for jobs.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {jobs.map((job) => {
          const isLongDescription = (job.description || "").length > 140;

          const shortDescription = isLongDescription
            ? `${job.description?.slice(0, 140)}...`
            : job.description;

          return (
            <Grid item xs={12} sm={6} md={3} key={job.id}>
              <Card
                onClick={() => navigate(`/dashboard/applications/${job.id}`)}
                sx={{
                  cursor: "pointer",
                  borderRadius: "16px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "none",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: "black",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Chip
                      label={job.status || "draft"}
                      size="small"
                      sx={{
                        textTransform: "capitalize",

                        bgcolor:
                          job.status === "active" ? "success.main" : "black",

                        color: "white",
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      lineHeight: 1.3,
                    }}
                  >
                    {job.title}
                  </Typography>

                  <Box
                    sx={{
                      flexGrow: 1,
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: 1.7,
                      }}
                    >
                      {shortDescription}
                    </Typography>

                    {isLongDescription && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          fontWeight: 600,
                          color: "primary.main",
                        }}
                      >
                        Show more
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mt: "auto" }}>
                    <Typography variant="caption" color="text.secondary">
                      Created At
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {new Date(job.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {!loading && jobs.length === 0 && (
        <Box
          sx={{
            py: 10,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            No jobs found
          </Typography>

          <Typography color="text.secondary">
            Create a job to start receiving applications.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
