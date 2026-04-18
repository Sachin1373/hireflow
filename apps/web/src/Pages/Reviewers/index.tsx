import { useEffect, useState } from "react";
import { Box, Typography, Button, Stack, Avatar, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SearchBar from "@/Components/SearchBar";
import AddReviewerDrawer from "./AddReviewerDrawer";
import BulkUploadModal from "./BulkUploadModal";
import CustomTable from "@/Components/CustomTable";
import api from "@/axiosInstance";
import type { Reviewer } from "../../../../../packages/types/src/index";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

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
                fontWeight: 600
            }}
          >
            {row.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: '700' }}>
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
      )
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
                borderColor: "grey.200"
            }} 
        />
      )
    },
    {
      field: "created_at",
      headerName: "Time Added",
      align: "right" as const,
      render: (row: any) => (
        <Typography variant="body2" color="text.secondary">
            {new Date(row.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })}
        </Typography>
      )
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
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            onClick={() => setModalOpen(true)}
            sx={{ textTransform: "none", borderRadius: "10px", fontWeight: 600 }}
          >
            Bulk Upload
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDrawerOpen(true)}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            Add Reviewer
          </Button>
        </Stack>
      </Box>

      <Box className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex items-center justify-between">
        <Box sx={{ width: { xs: "100%", sm: 350 } }}>
          <SearchBar
            placeholder="Search by name, email or designation..."
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
        onClose={() => {
          setDrawerOpen(false);
          fetchReviewers();
        }}
      />

      <BulkUploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
}