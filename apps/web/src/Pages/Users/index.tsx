import { useEffect, useState } from "react";
import { Box, Typography, Button, Stack, Avatar, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchBar from "@/Components/SearchBar";
import AddUserDrawer from "./AddUserDrawer";
import CustomTable from "@/Components/CustomTable";
import ConfirmDialog from "@/Components/ConfirmDialog";
import ActionMenu from "@/Components/ActionMenu";
import api from "@/axiosInstance";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function UsersPage() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 10;

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/list?page=${page}&limit=${limit}&search=${searchQuery}`);
      setUsers(res.data.data);
      if (res.data.pagination) {
        setTotal(res.data.pagination.total);
      }
    } catch (error) {
      console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await api.delete(`/users/${deleteId}`);
      toast.success("User removed successfully");
      setDeleteId(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove user");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery]);

  const columns = [
    {
      field: "first_name",
      headerName: "User",
      render: (row: any) => (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: "black" }}>
            {row.first_name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "600" }}>
              {row.first_name} {row.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      render: (row: any) => (
        <Chip
          label={row.role}
          size="small"
          sx={{
            borderRadius: "6px",
            bgcolor: "black",
            color: "white",
          }}
        />
      ),
    },
    {
      field: "created_at",
      headerName: "Joined Date",
      render: (row: any) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(row.created_at).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "",
      align: "right" as const,
      render: (row: any) => (
        <ActionMenu
          actions={[
            {
              label: "Edit",
              icon: <EditIcon fontSize="small" />,
              onClick: () => {
                setSelectedUser(row);
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
      ),
    },
  ];

  // Removed client-side filtering

  const canWrite =
    currentUser?.role === "ADMIN" ||
    (currentUser?.role === "HR" && currentUser.permissions?.write);

  return (
    <Box>
      <Box className="flex items-center justify-between mb-8">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "700" }}>
            Users
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage team members and their access levels.
          </Typography>
        </Box>

        {canWrite && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedUser(null);
              setDrawerOpen(true);
            }}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              bgcolor: "black",
              "&:hover": { bgcolor: "grey.900" },
            }}
          >
            Add User
          </Button>
        )}
      </Box>

      <Box className="mb-6 w-full max-w-sm">
        <SearchBar
          placeholder="Search by name or email..."
          onChange={(val) => setSearchQuery(val)}
        />
      </Box>

      <CustomTable
        columns={columns}
        rows={users}
        loading={loading}
        page={page}
        total={total}
        rowsPerPage={limit}
        onPageChange={(newPage) => setPage(newPage)}
      />

      <AddUserDrawer
        open={drawerOpen}
        initialData={selectedUser}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedUser(null);
          fetchUsers();
        }}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Remove User"
        description="Are you sure you want to remove this user? This action cannot be undone."
        confirmText="Remove"
        confirmColor="error"
        loading={isDeleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
