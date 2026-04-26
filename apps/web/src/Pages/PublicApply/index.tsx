import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/axiosInstance";
import DOMPurify from "dompurify";

type PublicField = {
  id: string;
  field_type: string;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
};

type PublicJobPayload = {
  title: string;
  description: string;
  jd_content: string;
  form_expires_at: string | null;
  is_expired: boolean;
  fields: PublicField[];
};

export default function PublicApplyPage() {
  const { publicToken } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState<PublicJobPayload | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [activeTab, setActiveTab] = useState<"jd" | "form">("form");
  const [uploadingFieldId, setUploadingFieldId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicJob = async () => {
      if (!publicToken) {
        setErrorState("Invalid application link.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`public/jobs/${publicToken}`);
        const payload: PublicJobPayload = response.data.data;
        setJob(payload);

        const initialValues = payload.fields.reduce<Record<string, string>>((acc, field) => {
          acc[field.id] = "";
          return acc;
        }, {});
        setValues(initialValues);
        setTouched({});
        setSubmitAttempted(false);
      } catch (error: any) {
        setErrorState(error?.response?.data?.message || "Unable to open this application link.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicJob();
  }, [publicToken]);

  const requiredFields = useMemo(() => {
    return (job?.fields || []).filter((field) => field.required);
  }, [job]);

  const getFieldError = (field: PublicField) => {
    const value = values[field.id]?.trim() || "";
    const canShowError = submitAttempted || !!touched[field.id];

    if (!canShowError) return "";
    if (field.required && !value) return `${field.label} is required`;

    if (value && field.field_type.toUpperCase() === "EMAIL") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Please enter a valid email";
    }

    return "";
  };

  const validateForm = () => {
    for (const field of requiredFields) {
      if (!values[field.id]?.trim()) {
        toast.error(`${field.label} is required`);
        return false;
      }
    }
    return true;
  };

  const handleChange = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    setTouched((prev) => ({ ...prev, [fieldId]: true }));
  };

  const handleFileChange = async (fieldId: string, file?: File) => {
    if (!file) return;

    try {
      setUploadingFieldId(fieldId);
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/public/uploads/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res?.data?.data?.url as string | undefined;
      if (!url) {
        toast.error("Upload failed");
        return;
      }

      setValues((prev) => ({ ...prev, [fieldId]: url }));
      setTouched((prev) => ({ ...prev, [fieldId]: true }));
      toast.success("Resume uploaded");
    } catch (error: any) {
      console.error("Resume upload error:", error);
      toast.error(error?.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploadingFieldId(null);
    }
  };

  const renderField = (field: PublicField) => {
    const commonProps = {
      fullWidth: true,
      label: field.label,
      required: field.required,
      value: values[field.id] || "",
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        handleChange(field.id, event.target.value),
      placeholder: field.placeholder || "",
      error: !!getFieldError(field),
      helperText: getFieldError(field),
    };

    const fieldType = field.field_type.toUpperCase();

    if (fieldType === "SELECT") {
      return (
        <TextField select {...commonProps}>
          {(field.options || []).map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (fieldType === "DATE") {
      return <TextField type="date" InputLabelProps={{ shrink: true }} {...commonProps} />;
    }

    if (fieldType === "NUMBER") {
      return <TextField type="number" {...commonProps} />;
    }

    if (fieldType === "EMAIL") {
      return <TextField type="email" {...commonProps} />;
    }

    if (fieldType === "FILE") {
      const fieldError = getFieldError(field);
      return (
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {field.label}
            {field.required ? " *" : ""}
          </Typography>
          <Box
            sx={{
              border: "1px dashed",
              borderColor: fieldError ? "error.main" : "grey.400",
              borderRadius: 2,
              py: 4,
              px: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Upload your file or drag and drop here
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supported formats: .pdf, .docx
            </Typography>
            <Button variant="outlined" component="label" sx={{ textTransform: "none" }}>
              {uploadingFieldId === field.id ? "Uploading..." : "Upload file"}
              <input
                hidden
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => handleFileChange(field.id, event.target.files?.[0])}
              />
            </Button>
            {values[field.id] ? (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Uploaded: {values[field.id].split("/").pop()}
              </Typography>
            ) : null}
          </Box>
          {fieldError ? (
            <Typography variant="caption" color="error.main">
              {fieldError}
            </Typography>
          ) : null}
        </Stack>
      );
    }

    if (fieldType === "TEXTAREA") {
      return <TextField multiline minRows={3} {...commonProps} />;
    }

    return <TextField type="text" {...commonProps} />;
  };

  const handleSubmit = async () => {
    if (!job || !publicToken) return;
    setSubmitAttempted(true);
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await api.post(`/public/jobs/${publicToken}/apply`, {
        responses: job.fields.map((field) => ({
          field_id: field.id,
          value: values[field.id] || "",
        })),
      });

      toast.success("Application submitted successfully");
      setValues(
        job.fields.reduce<Record<string, string>>((acc, field) => {
          acc[field.id] = "";
          return acc;
        }, {})
      );
      setTouched({});
      setSubmitAttempted(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorState) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{errorState}</Alert>
      </Container>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {job.title}
          </Typography>
          <Typography color="text.secondary">{job.description}</Typography>
          {job.form_expires_at ? (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Apply before: {new Date(job.form_expires_at).toLocaleString()}
            </Typography>
          ) : null}
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, nextValue: "jd" | "form") => setActiveTab(nextValue)}
            sx={{ mb: 2 }}
          >
            <Tab value="jd" label="Job Description" />
            <Tab value="form" label="Application Form" />
          </Tabs>

          {activeTab === "jd" ? (
            <Box sx={{ maxHeight: "60vh", overflowY: "auto", pr: 1 }}>
              <Box dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.jd_content) || "<p>-</p>" }} />
            </Box>
          ) : job.is_expired ? (
            <Alert severity="warning">This application link has expired.</Alert>
          ) : (
            <Stack spacing={2} sx={{ maxHeight: "60vh", overflowY: "auto", pr: 1 }}>
              {job.fields.map((field) => (
                <Box sx={{ pt:1 }} key={field.id}>{renderField(field)}</Box>
              ))}
              <Box>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting}
                  sx={{ textTransform: "none", bgcolor: "black" }}
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </Box>
            </Stack>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
