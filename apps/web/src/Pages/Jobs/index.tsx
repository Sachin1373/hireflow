import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchBar from "@/Components/SearchBar";
import CustomTable from "@/Components/CustomTable";
import ConfirmDialog from "@/Components/ConfirmDialog";
import ActionMenu from "@/Components/ActionMenu";
import api from "@/axiosInstance";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function JobsPage() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
   const [searchQuery, setSearchQuery] = useState("");
   const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const canWrite =
    currentUser?.role === "ADMIN" ||
    (currentUser?.role === "HR" && currentUser.permissions?.write);

    const handleCreateJob = () => {
      navigate('/dashboard/jobs/new')
    }

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
              // setSearchQuery(val);
              // setPage(1);
            }}
          />
        </Box>

        <Typography variant="caption" color="text.disabled">
          {searchQuery
            ? `Searching for "${searchQuery}"`
            : `Total: ${total} Reviewers`}
        </Typography>
      </Box>

      {/* <CustomTable
        columns={columns}
        rows={reviewers}
        loading={loading}
        page={page}
        total={total}
        rowsPerPage={limit}
        onPageChange={setPage}
      /> */}

      {/* Delete Confirmation */}
      {/* <ConfirmDialog
        open={!!deleteId}
        title="Remove Reviewer"
        description="Are you sure you want to remove this reviewer? This action cannot be undone."
        confirmText="Remove"
        confirmColor="error"
        loading={isDeleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      /> */}
    </Box>
  )
}
