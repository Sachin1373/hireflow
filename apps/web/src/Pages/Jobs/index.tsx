import { useEffect, useState } from "react";
import { Box, Typography, Button, Stack, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SearchBar from "@/Components/SearchBar";
import CustomTable from "@/Components/CustomTable";
import ActionMenu from "@/Components/ActionMenu";
import ConfirmDialog from "@/Components/ConfirmDialog";
import api from "@/axiosInstance";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { toast } from "react-toastify";

type JobRow = {
  id: string;
  title: string;
  status?: string;
  created_at?: string;
  slug?: string;
};

export default function JobsPage() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobRow | null>(null);
  const limit = 10;

  const canWrite =
    currentUser?.role === "ADMIN" ||
    (currentUser?.role === "HR" && currentUser.permissions?.write);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/jobs/list?page=${page}&limit=${limit}&search=${searchQuery}`,
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

  const handleCreateJob = () => {
    navigate("/dashboard/jobs/new");
  };

  const handleEdit = (job: JobRow) => {
    navigate(`/dashboard/jobs/new?jobId=${job.id}`);
  };

  const handleOpenDeleteDialog = (job: JobRow) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleCopyCandidateLink = async (job: JobRow) => {
    if (!job.slug) {
      toast.error("Candidate link is not available yet");
      return;
    }

    const candidateUrl = `${window.location.origin}/apply/${job.slug}`;
    try {
      await navigator.clipboard.writeText(candidateUrl);
      toast.success("Candidate link copied");
    } catch (error) {
      console.error("Copy candidate link error:", error);
      toast.error("Failed to copy candidate link");
    }
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/jobs/${jobToDelete.id}`);
      toast.success("Job deleted successfully");
      setDeleteDialogOpen(false);
      setJobToDelete(null);
      fetchJobs();
    } catch (error: any) {
      console.error("Delete job error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete job");
    } finally {
      setDeleteLoading(false);
    }
  };

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
      field: "candidate_link",
      headerName: "Candidate Link",

      render: (row: JobRow) => (
        <Button
          size="small"
          variant="outlined"
          startIcon={<ContentCopyIcon fontSize="small" />}
          onClick={() => handleCopyCandidateLink(row)}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Copy Link
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      align: "center" as const,

      render: (row: JobRow) => {
        const actions = [];

        if (row.status !== "submitted") {
          actions.push({
            label: "Edit",

            icon: <EditIcon fontSize="small" />,

            onClick: () => handleEdit(row),
          });
        }

        actions.push({
          label: "Delete",

          icon: <DeleteIcon fontSize="small" />,

          onClick: () => handleOpenDeleteDialog(row),

          color: "#d32f2f",

          dividerBefore: true,
        });

        return <ActionMenu actions={actions} />;
      },
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

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Job"
        description={`Are you sure you want to delete "${jobToDelete?.title || "this job"}"? This action cannot be undone.`}
        loading={deleteLoading}
        onClose={() => {
          if (deleteLoading) return;
          setDeleteDialogOpen(false);
          setJobToDelete(null);
        }}
        onConfirm={handleDeleteJob}
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
}
