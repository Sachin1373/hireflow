import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Select, MenuItem, FormControlLabel, Checkbox, IconButton, Paper, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import api from "@/axiosInstance";
import { toast } from "react-toastify";

type FormField = {
  field_type: string;
  label: string;
  required: boolean;
};

type Props = {
  jobId?: string | null;
  data: FormField[];
  setData: (data: FormField[]) => void;
  registerSave: (fn: () => Promise<boolean>) => void;
};

const FIELD_TYPES = ["TEXT", "EMAIL", "FILE", "NUMBER", "DATE", "SELECT"];

const ApplicationForm = ({ jobId, data, setData, registerSave }: Props) => {
  const [fields, setFields] = useState<FormField[]>(() => {
    if (data && data.length > 0) return data;
    return [
      { field_type: "TEXT", label: "Full Name", required: true },
      { field_type: "EMAIL", label: "Email Address", required: true },
      { field_type: "FILE", label: "Resume", required: true },
    ];
  });

  useEffect(() => {
    if (jobId && (!data || data.length === 0)) {
       api.get(`/jobs/${jobId}/fields`).then(res => {
         if (res.data.data && res.data.data.length > 0) {
           setFields(res.data.data);
           setData(res.data.data);
         }
       }).catch(err => console.error("Error fetching fields:", err));
    }
  }, [jobId]);

  useEffect(() => {
    setData(fields);
  }, [fields]);

  useEffect(() => {
    registerSave(async () => {
      if (!jobId) {
        toast.error("Please save job details first");
        return false;
      }
      try {
        await api.post(`/jobs/${jobId}/fields`, { fields });
        toast.success("Form fields saved successfully");
        return true;
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to save form fields");
        return false;
      }
    });
  }, [fields, jobId]);

  const addField = () => {
    setFields([...fields, { field_type: "TEXT", label: "", required: false }]);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const updateField = (index: number, key: keyof FormField, value: any) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Custom Application Form</Typography>
      <Typography variant="body2" color="text.secondary">
        Add custom fields that candidates must fill out when applying for this role.
      </Typography>

      <Stack sx={{ minHeight: '350px', maxHeight: "450px",  overflowY: "auto", }} spacing={2}>
        {fields.map((field, idx) => (
          <Paper key={idx} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', border: '1px solid #ddd', borderRadius: 2, boxShadow: 'none' }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                size="small"
                fullWidth
                label="Field Label"
                value={field.label}
                onChange={(e) => updateField(idx, "label", e.target.value)}
                placeholder="e.g. Portfolio URL"
              />
            </Box>
            <Box sx={{ width: 150 }}>
              <Select
                size="small"
                fullWidth
                value={field.field_type}
                onChange={(e) => updateField(idx, "field_type", e.target.value)}
              >
                {FIELD_TYPES.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ width: 100 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.required}
                    onChange={(e) => updateField(idx, "required", e.target.checked)}
                    sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }}
                  />
                }
                label="Required"
                sx={{ m: 0 }}
              />
            </Box>
            <IconButton onClick={() => removeField(idx)} sx={{ color: '#d32f2f' }}>
              <DeleteIcon />
            </IconButton>
          </Paper>
        ))}
      </Stack>

      <Box>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addField}
          sx={{
            textTransform: "none",
            color: "black",
            borderColor: "black",
            "&:hover": { borderColor: "black", bgcolor: "#f5f5f5" },
          }}
        >
          Add Field
        </Button>
      </Box>
    </Box>
  );
};

export default ApplicationForm;