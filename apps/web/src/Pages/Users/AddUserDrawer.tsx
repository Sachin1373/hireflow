import { useEffect } from "react";
import { Drawer, Box, Typography, TextField, Button, IconButton, Stack, Checkbox, FormControlLabel } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import api from "@/axiosInstance";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: any;
};

type FormInputs = {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  permissions: {
    read: boolean;
    write: boolean;
  };
};

export default function AddUserDrawer({ open, onClose, initialData }: Props) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>({
      defaultValues: {
          permissions: {
              read: true,
              write: false
          }
      }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        first_name: initialData.first_name,
        last_name: initialData.last_name,
        email: initialData.email,
        permissions: initialData.permissions || { read: true, write: false }
      });
    } else if (open) {
      reset({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        permissions: { read: true, write: false }
      });
    }
  }, [initialData, reset, open]);

  const onSubmit = async (data: FormInputs) => {
    try {
      if (initialData) {
        const { password, ...payload } = data;
        await api.patch(`/users/${initialData.id}`, payload);
        toast.success("User updated successfully");
      } else {
        await api.post("/users/create", {
          ...data,
          role: "HR"
        });
        toast.success("HR User invited successfully");
      }
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: { xs: "100%", sm: 450 }, p: 4 },
        }
      }}
    >
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Manage Organization Users
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Fill out the details below to invite a new HR member. They will be assigned the role of **HR** by default.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2}>
            <TextField
                label="First Name"
                fullWidth
                size="small"
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                {...register("first_name", { required: "First name is required" })}
            />
            <TextField
                label="Last Name"
                fullWidth
                size="small"
                {...register("last_name")}
            />
          </Stack>

          <TextField
            label="Email Address"
            fullWidth
            size="small"
            type="email"
            placeholder="johndoe@company.com"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email", { 
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
            })}
          />
          
          {!initialData && (
            <TextField
              label="Initial Password"
              fullWidth
              size="small"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password", { 
                  required: "Initial password is required",
                  minLength: { value: 6, message: "Min 6 characters" }
              })}
            />
          )}

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
              Base Permissions
            </Typography>
            <Stack direction="row" spacing={4}>
              <FormControlLabel
                control={<Checkbox defaultChecked {...register("permissions.read")} />}
                label={<Typography variant="body2">Read Access</Typography>}
              />
              <FormControlLabel
                control={<Checkbox {...register("permissions.write")} />}
                label={<Typography variant="body2">Write / Manage Access</Typography>}
              />
            </Stack>
          </Box>

          <Box className="pt-6 flex gap-3">
            <Button 
                variant="contained" 
                fullWidth 
                type="submit"
                sx={{ 
                    textTransform: 'none', 
                    borderRadius: '10px', 
                    fontWeight: 700,
                    py: 1.2,
                    bgcolor: 'black',
                    '&:hover': { bgcolor: 'grey.900' }
                }}
            >
              {initialData ? "Update User" : "Send Invitation"}
            </Button>
            <Button 
                variant="outlined" 
                fullWidth 
                onClick={onClose}
                sx={{ textTransform: 'none', borderRadius: '10px', py: 1.2, color: 'text.primary', borderColor: 'grey.300' }}
            >
              Discard
            </Button>
          </Box>
        </Stack>
      </form>
    </Drawer>
  );
}
