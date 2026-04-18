import { Drawer, Box, Typography, TextField, Button, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import api from "@/axiosInstance";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormInputs = {
  name: string;
  email: string;
  designation: string;
};

export default function AddReviewerDrawer({ open, onClose }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  const onSubmit = async(data: FormInputs) => {
    try {
     
    await api.post('/reviewer/create', data)
    toast.success("Reviewer added successfully");
    onClose();
    } catch (error: any) {
      console.error(error);

    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Failed to add reviewer"
    );
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: { xs: "100%", sm: 450 }, p: 3 },
        }
      }}
    >
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h6"  sx={{ fontWeight: 700 }}>
          Add New Reviewer
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Fill in the details below to manually add a new reviewer to your list.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            label="Full Name"
            fullWidth
            size="small"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />
          <TextField
            label="Email Address"
            fullWidth
            size="small"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email", { 
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
            })}
          />
          <TextField
            label="Designation"
            fullWidth
            size="small"
            error={!!errors.designation}
            helperText={errors.designation?.message}
            {...register("designation", { required: "Designation is required" })}
          />

          <Box className="pt-4 flex gap-3">
            <Button 
                variant="contained" 
                fullWidth 
                type="submit"
                sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Add Reviewer
            </Button>
            <Button 
                variant="outlined" 
                fullWidth 
                onClick={onClose}
                sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </form>
    </Drawer>
  );
}
