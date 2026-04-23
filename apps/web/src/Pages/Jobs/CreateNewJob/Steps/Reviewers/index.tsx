import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Avatar,
  Checkbox,
} from "@mui/material";

import SearchBar from "@/Components/SearchBar";
import CustomTable from "@/Components/CustomTable";
import api from "@/axiosInstance";
import { toast } from "react-toastify";

type Reviewer = {
  id: string;
  name: string;
  email: string;
  designation: string;
  created_at: string;
};

type Props = {
  jobId?: string | null;
  data: Reviewer[];
  setData: (data: Reviewer[]) => void;
  onSelectionChange: () => void;
  registerSave: (fn: () => Promise<boolean>) => void;
};

type ReviewerResponse = {
  data: Reviewer[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const LIMIT = 5;

const Reviewers = ({ jobId, data, setData, onSelectionChange, registerSave }: Props) => {
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const selectedReviewerIds = new Set(data.map((r) => r.id));

  const fetchReviewers = async () => {
    try {
      setLoading(true);

      const res = await api.get<ReviewerResponse>("/reviewer/fetchAll", {
        params: {
          page,
          limit: LIMIT,
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

  useEffect(() => {
    registerSave(async () => {
      if (!jobId) {
        toast.error("Please save job details first");
        return false;
      }
      if (data.length === 0) {
        toast.error("Please select at least one reviewer");
        return false;
      }
      try {
        const reviewerIds = data.map((r) => r.id);
        await api.post(`/jobs/${jobId}/reviewers`, { reviewerIds });
        toast.success("Reviewers assigned successfully");
        return true;
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to assign reviewers");
        return false;
      }
    });
  }, [data, jobId]);

  const toggleReviewer = (reviewer: Reviewer) => {
    const exists = selectedReviewerIds.has(reviewer.id);

    if (exists) {
      setData(data.filter((r) => r.id !== reviewer.id));
    } else {
      setData([...data, reviewer]);
    }
    onSelectionChange();
  };

  const handleSelectAll = () => {
    const allSelected = reviewers.every((r) =>
      selectedReviewerIds.has(r.id)
    );

    if (allSelected) {
      const currentPageIds = new Set(reviewers.map((r) => r.id));

      setData(data.filter((r) => !currentPageIds.has(r.id)));
    } else {
      const merged = [...data];

      reviewers.forEach((reviewer) => {
        const exists = merged.find((r) => r.id === reviewer.id);

        if (!exists) {
          merged.push(reviewer);
        }
      });

      setData(merged);
    }
    onSelectionChange();
  };

  const isAllSelected =
    reviewers.length > 0 &&
    reviewers.every((r) => selectedReviewerIds.has(r.id));

  const columns = [
    {
      field: "select",
      headerName: (
        <Checkbox
          checked={isAllSelected}
          onChange={handleSelectAll}
        />
      ),
      render: (row: Reviewer) => (
        <Checkbox
          checked={selectedReviewerIds.has(row.id)}
          onClick={(e) => e.stopPropagation()}
          onChange={() => toggleReviewer(row)}
        />
      ),
    },

    {
      field: "name",
      headerName: "Reviewer",
      render: (row: Reviewer) => (
        <Stack sx={ {alignItems: 'center' }} direction="row" spacing={2}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "black",
              fontWeight: 600,
            }}
          >
            {row.name.charAt(0).toUpperCase()}
          </Avatar>

          <Box>
            <Typography sx={{ fontWeight: '700' }}>
              {row.name}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {row.designation}
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

    {
      field: "created_at",
      headerName: "Added",
      render: (row: Reviewer) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(row.created_at).toLocaleDateString()}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ maxHeight: "65vh",
        overflowY: "auto", }}>
      <Box
        className="bg-white p-4 rounded-xl border border-gray-200"
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ width: 350 }}>
          <SearchBar
            placeholder="Search reviewers..."
            onChange={(val) => {
              setSearchQuery(val);
              setPage(1);
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          {data.length} reviewer(s) selected
        </Typography>
      </Box>

      <CustomTable
        columns={columns}
        rows={reviewers}
        loading={loading}
        page={page}
        total={total}
        rowsPerPage={LIMIT}
        onPageChange={setPage}
      />
    </Box>
  );
};

export default Reviewers;