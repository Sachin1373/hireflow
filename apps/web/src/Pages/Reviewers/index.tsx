import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SearchBar from "@/Components/SearchBar";
import AddReviewerDrawer from "./AddReviewerDrawer";
import BulkUploadModal from "./BulkUploadModal";
import CustomTable from "@/Components/CustomTable";
import ConfirmDialog from "@/Components/ConfirmDialog";
import ActionMenu from "@/Components/ActionMenu";
import api from "@/axiosInstance";
import { toast } from "react-toastify";
import type { Reviewer } from "../../../../../packages/types/src/index";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

type ReviewerResponse = {
  data: Reviewer[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export default function ReviewersPage() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔹 Deletion state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canWrite =
    currentUser?.role === "ADMIN" ||
    (currentUser?.role === "HR" && currentUser.permissions?.write);

  const limit = 10;

  const fetchReviewers = async () => {
    try {
      setLoading(true);

      const res = await api.get<ReviewerResponse>("/reviewer/fetchAll", {
        params: {
          page,
          limit,
          search: searchQuery,
        },
      });

      setReviewers(res.data.data);
      setTotal(res.data.pagination.total);
    } catch (error) {
      console.error("Fetch reviewers error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await api.delete(`/reviewer/${deleteId}`);
      toast.success("Reviewer removed successfully");
      setDeleteId(null);
      fetchReviewers();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to remove reviewer");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchReviewers();
    }, 400);

    return () => clearTimeout(delay);
  }, [page, searchQuery]);

  const columns = [
    {
      field: "name",
      headerName: "Reviewer",
      render: (row: any) => (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: "0.875rem",
              bgcolor: "black",
              fontWeight: 600,
            }}
          >
            {row.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ fontWeight: "700" }}
            >
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row.id.slice(0, 8)}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: "email",
      headerName: "Email Address",
      render: (row: any) => (
        <Typography variant="body2" color="text.secondary">
          {row.email}
        </Typography>
      ),
    },
    {
      field: "designation",
      headerName: "Designation",
      render: (row: any) => (
        <Chip
          label={row.designation}
          size="small"
          sx={{
            borderRadius: "6px",
            fontWeight: 500,
            backgroundColor: "grey.100",
            color: "text.secondary",
            border: "1px solid",
            borderColor: "grey.200",
          }}
        />
      ),
    },
    {
      field: "created_at",
      headerName: "Time Added",
      align: "right" as const,
      render: (row: any) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(row.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "",
      align: "right" as const,
      render: (row: any) =>
        canWrite ? (
          <ActionMenu
            actions={[
              {
                label: "Edit",
                icon: <EditIcon fontSize="small" />,
                onClick: () => {
                  setSelectedReviewer(row);
                  setDrawerOpen(true);
                },
              },
              {
                label: "Delete",
                icon: <DeleteIcon fontSize="small" />,
                onClick: () => setDeleteId(row.id),
                color: "#d32f2f",
                dividerBefore: true,
              },
            ]}
          />
        ) : null,
    },
  ];

  return (
    <Box>
      <Box className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Reviewers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your team of interviewers and technical reviewers.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          {canWrite && (
            <>
              <Button
                variant="outlined"
                startIcon={<FileUploadIcon />}
                onClick={() => setModalOpen(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                  fontWeight: 600,
                }}
              >
                Bulk Upload
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedReviewer(null);
                  setDrawerOpen(true);
                }}
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                  bgcolor: "black",
                }}
              >
                Add Reviewer
              </Button>
            </>
          )}
        </Stack>
      </Box>

      <Box className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex items-center justify-between">
        <Box sx={{ width: { xs: "100%", sm: 350 } }}>
          <SearchBar
            placeholder="Search by name, email"
            onChange={(val) => {
              setSearchQuery(val);
              setPage(1);
            }}
          />
        </Box>

        <Typography variant="caption" color="text.disabled">
          {searchQuery
            ? `Searching for "${searchQuery}"`
            : `Total: ${total} Reviewers`}
        </Typography>
      </Box>

      <CustomTable
        columns={columns}
        rows={reviewers}
        loading={loading}
        page={page}
        total={total}
        rowsPerPage={limit}
        onPageChange={setPage}
      />

      <AddReviewerDrawer
        open={drawerOpen}
        initialData={selectedReviewer}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedReviewer(null);
          fetchReviewers();
        }}
      />

      <BulkUploadModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchReviewers();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        title="Remove Reviewer"
        description="Are you sure you want to remove this reviewer? This action cannot be undone."
        confirmText="Remove"
        confirmColor="error"
        loading={isDeleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
