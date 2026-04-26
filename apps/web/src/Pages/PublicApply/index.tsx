import { ChangeEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

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

const API_BASE_URL = "http://localhost:3001/api";

const normalizeLabel = (label: string) => label.trim().toLowerCase();

const inferCandidateCoreFields = (fields: PublicField[], values: Record<string, string>) => {
  let candidateName = "";
  let candidateEmail = "";
  let candidatePhone = "";
  let resumeUrl = "";

  for (const field of fields) {
    const value = values[field.id]?.trim() || "";
    const normalized = normalizeLabel(field.label);

    if (!candidateName && (normalized.includes("name") || normalized.includes("full name"))) {
      candidateName = value;
    }
    if (!candidateEmail && normalized.includes("email")) {
      candidateEmail = value;
    }
    if (!candidatePhone && (normalized.includes("phone") || normalized.includes("mobile"))) {
      candidatePhone = value;
    }
    if (!resumeUrl && (normalized.includes("resume") || normalized.includes("cv"))) {
      resumeUrl = value;
    }
  }

  return { candidateName, candidateEmail, candidatePhone, resumeUrl };
};

export default function PublicApplyPage() {
  const { publicToken } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState<PublicJobPayload | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPublicJob = async () => {
      if (!publicToken) {
        setErrorState("Invalid application link.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/public/jobs/${publicToken}`);
        const payload: PublicJobPayload = response.data.data;
        setJob(payload);

        const initialValues = payload.fields.reduce<Record<string, string>>((acc, field) => {
          acc[field.id] = "";
          return acc;
        }, {});
        setValues(initialValues);
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
    if (!field.required) return "";
    if (values[field.id]?.trim()) return "";
    return `${field.label} is required`;
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
      return <TextField type="url" {...commonProps} placeholder={field.placeholder || "Paste file URL"} />;
    }

    if (fieldType === "TEXTAREA") {
      return <TextField multiline minRows={3} {...commonProps} />;
    }

    return <TextField type="text" {...commonProps} />;
  };

  const handleSubmit = async () => {
    if (!job || !publicToken) return;
    if (!validateForm()) return;

    const inferred = inferCandidateCoreFields(job.fields, values);
    if (!inferred.candidateName || !inferred.candidateEmail) {
      toast.error("Form must include name and email fields.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API_BASE_URL}/public/jobs/${publicToken}/apply`, {
        candidate_name: inferred.candidateName,
        candidate_email: inferred.candidateEmail,
        candidate_phone: inferred.candidatePhone || undefined,
        resume_url: inferred.resumeUrl || undefined,
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
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Job Description
          </Typography>
          <Box dangerouslySetInnerHTML={{ __html: job.jd_content || "<p>-</p>" }} />
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Application Form
          </Typography>

          {job.is_expired ? (
            <Alert severity="warning">This application link has expired.</Alert>
          ) : (
            <Stack spacing={2}>
              {job.fields.map((field) => (
                <Box key={field.id}>{renderField(field)}</Box>
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
