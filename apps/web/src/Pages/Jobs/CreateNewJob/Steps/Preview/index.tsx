import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/axiosInstance";
import CustomTable from "@/Components/CustomTable";
import dayjs from "dayjs";

type Reviewer = {
  id: string;
  name: string;
  email: string;
  designation?: string;
  created_at?: string;
};

type Field = {
  field_type: string;
  label: string;
  required: boolean;
};

type PreviewData = {
  meta: {
    title?: string;
    description?: string;
    jd_content?: string;
  };
  application: Field[];
  reviewers: Reviewer[];
};

type Props = {
  data: PreviewData;
  jobId?: string | null;
  registerSubmit: (fn: () => void) => void;
};

const REVIEWERS_PER_PAGE = 5;

const Preview = ({ data, jobId, registerSubmit }: Props) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [expiryAt, setExpiryAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reviewers = data.reviewers || [];
  const paginatedReviewers = useMemo(() => {
    const start = (page - 1) * REVIEWERS_PER_PAGE;
    return reviewers.slice(start, start + REVIEWERS_PER_PAGE);
  }, [page, reviewers]);

  const reviewerColumns = [
    {
      field: "name",
      headerName: "Reviewer",
      render: (row: Reviewer) => (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: "black", fontWeight: 600 }}>
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

  const handleSubmitJob = async () => {
    if (!jobId) {
      toast.error("Job ID not found. Save draft first.");
      return;
    }

    if (!expiryAt) {
      toast.error("Please select expiry date and time");
      return;
    }


    const isoDate = dayjs(expiryAt).toISOString();
    
    try {
      setSubmitting(true);
      await api.patch(`/jobs/${jobId}`, {
        exp: dayjs(expiryAt).toISOString(),
        status: "submitted",
      });
      toast.success("Job submitted successfully");
      setOpenDialog(false);
      navigate("/dashboard/jobs");
    } catch (error) {
      console.error("Submit job error:", error);
      toast.error("Failed to submit job");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    registerSubmit(() => setOpenDialog(true));
  }, [registerSubmit]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxHeight: "65vh",
        overflowY: "auto",
        pr: 1,
      }}
    >
      <Box className="bg-white p-5 rounded-xl border border-gray-200">
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Job Details
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Title
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>{data.meta?.title || "-"}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Short Description
            </Typography>
            <Typography color="text.secondary">
              {data.meta?.description || "-"}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box className="bg-white p-5 rounded-xl border border-gray-200">
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Application Fields
        </Typography>
        <Stack spacing={1.5}>
          {(data.application || []).map((field, idx) => (
            <Box
              key={`${field.label}-${idx}`}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 2,
                px: 2,
                py: 1.5,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{field.label || "-"}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {field.field_type}
                </Typography>
              </Box>
              {field.required ? (
                <Chip label="Required" size="small" sx={{ bgcolor: "black", color: "white" }} />
              ) : (
                <Chip label="Optional" size="small" variant="outlined" />
              )}
            </Box>
          ))}
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
          total={reviewers.length}
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
            __html: data.meta?.jd_content || "<p>-</p>",
          }}
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => !submitting && setOpenDialog(false)}
        slotProps={{
          paper: {
            sx: { borderRadius: "12px", minWidth: 420 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Submit Job</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select the job expiry date and time before submitting.
          </Typography>
          <TextField
            fullWidth
            // label="Expiry Date & Time"
            type="datetime-local"
            value={expiryAt}
            onChange={(e) => setExpiryAt(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            disabled={submitting}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitJob}
            variant="contained"
            disabled={submitting}
            sx={{ textTransform: "none", bgcolor: "black" }}
          >
            {submitting ? "Submitting..." : "Confirm Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Preview;