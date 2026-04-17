import { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SearchBar from "@/Components/SearchBar";
import AddReviewerDrawer from "./AddReviewerDrawer";
import BulkUploadModal from "./BulkUploadModal";

export default function ReviewersPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Box>
      {/* Header Section */}
      <Box className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
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
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setDrawerOpen(true)}
            sx={{ 
                textTransform: "none", 
                borderRadius: "10px", 
                fontWeight: 600,
                boxShadow: 'none',
                "&:hover": { boxShadow: 'none' }
            }}
          >
            Add Reviewer
          </Button>
        </Stack>
      </Box>

      {/* Toolbar Section */}
      <Box className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex items-center justify-between">
        <Box sx={{ width: { xs: "100%", sm: 350 } }}>
          <SearchBar 
            placeholder="Search by name, email or designation..." 
            onChange={(val) => setSearchQuery(val)}
          />
        </Box>
        
        <Box>
            <Typography variant="caption" color="text.disabled">
                {searchQuery ? `Searching for "${searchQuery}"` : "Total: 0 Reviewers"}
            </Typography>
        </Box>
      </Box>

      {/* Table/List Placeholder */}
      <Box className="bg-white rounded-xl border border-gray-200 min-h-[400px] flex items-center justify-center">
        <Typography color="text.disabled">
            No reviewers added yet. Start by adding one manually or bulk uploading via CSV.
        </Typography>
      </Box>

      {/* Slide-out Drawer & Modal */}
      <AddReviewerDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <BulkUploadModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
}