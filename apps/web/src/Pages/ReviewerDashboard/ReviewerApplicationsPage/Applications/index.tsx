import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import CustomTable from "@/Components/CustomTable";

const mockApplications = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    experience: "3 Years",
    status: "Pending",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    experience: "5 Years",
    status: "Pending",
  },
];

const ReviewApplications = () => {
  const columns = [
    {
      field: "candidate",
      headerName: "Candidate",
      render: (row: any) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar>
            {row.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: '600' }}>
              {row.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {row.email}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: "experience",
      headerName: "Experience",
      render: (row: any) => (
        <Typography>
          {row.experience}
        </Typography>
      ),
    },
    {
      field: "resume",
      headerName: "Resume",
      render: () => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<VisibilityIcon />}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          View Resume
        </Button>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      render: (row: any) => (
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
      render: () => (
        <Stack direction="row" spacing={1}>
          <IconButton
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
      ),
    },
  ];

  return (
    <Box>
      {/* PAGE HEADER */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Review Applications
        </Typography>

        <Typography color="text.secondary">
          Review assigned candidates for this job.
        </Typography>
      </Box>

      {/* JOB DETAILS */}

      <Paper
        sx={{
          p: 4,
          borderRadius: "16px",
          mb: 4,
          boxShadow: "none",
          border: "1px solid #e5e7eb",
        }}
      >
        <Box
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-4"
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Senior Backend Engineer
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: "800px",
                lineHeight: 1.8,
              }}
            >
              Looking for an experienced backend
              engineer with strong knowledge in
              Node.js, Golang, distributed systems,
              PostgreSQL, and scalable API design.
            </Typography>
          </Box>

          <Chip
            label="Active"
            color="success"
          />
        </Box>

        <Grid
          container
          spacing={3}
          sx={{ mt: 3 }}
        >
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Department
            </Typography>

            <Typography sx={{ fontWeight: '600' }}>
              Engineering
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Experience Required
            </Typography>

            <Typography sx={{ fontWeight: '600' }}>
              3-5 Years
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Total Applications
            </Typography>

            <Typography sx={{ fontWeight: '600' }}>
              24 Candidates
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Deadline
            </Typography>

            <Typography sx={{ fontWeight: '600' }}>
              30 Apr 2026
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* APPLICATION TABLE */}

      <Paper
        sx={{
          p: 3,
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "none",
        }}
      >
        <Box
          className="flex items-center justify-between mb-4"
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Assigned Candidates
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Review and take action on
              applications.
            </Typography>
          </Box>
        </Box>

        <CustomTable
          columns={columns}
          rows={mockApplications}
          loading={false}
          page={1}
          total={mockApplications.length}
          rowsPerPage={10}
          onPageChange={() => {}}
        />
      </Paper>
    </Box>
  );
};

export default ReviewApplications;