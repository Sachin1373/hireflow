import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import { downloadSampleCSV } from "@/utilis";
import api from "@/axiosInstance";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BulkUploadModal({ open, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async() => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await api.post("/reviewer/bulk", formData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex items-center justify-center"
    >
      <Box
        sx={{
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: "16px",
          boxShadow: 24,
          p: 4,
          outline: "none",
        }}
      >
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            Bulk Upload Reviewers
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Upload a CSV file containing reviewer details (name, email,
          designation).
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Button
            variant="text"
            onClick={downloadSampleCSV}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              px: 0,
              minWidth: "auto",
              textDecoration: "underline",
            }}
          >
            Download Sample CSV
          </Button>
        </Box>

        <Box
          component="label"
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors"
        >
          <input type="file" hidden accept=".csv" onChange={handleFileChange} />
          <CloudUploadIcon
            sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: "600" }}>
            {file ? file.name : "Click to upload or drag & drop"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            CSV files only (max. 10MB)
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={!file}
            onClick={handleUpload}
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Upload & Process
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={onClose}
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
