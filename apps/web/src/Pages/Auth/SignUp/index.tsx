import {
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import PasswordField from "@/Components/PasswordField";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/axiosInstance";

type Inputs = {
  first_name: string;
  last_name: string;
  org_name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { confirmPassword, ...payload } = data;
    try {
      await api.post("auth/signup", payload);
      toast.success("Account created successfully");
      navigate('/login')
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box className="min-h-screen flex">
      <Box className="hidden md:flex w-1/2 bg-blue-50">
        <img
          src="/auth.svg"
          alt="signup"
          className="w-full h-full object-contain"
        />
      </Box>

      <Box className="flex w-full md:w-1/2 items-center justify-center px-6">
        <Box className="w-full max-w-md space-y-6">
          <Box>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-gray-500 text-sm">
              Start managing your hiring pipeline
            </p>
          </Box>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Box className="flex gap-4">
              <TextField
                label="First Name"
                fullWidth
                size="small"
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                {...register("first_name", {
                  required: "First name is required",
                })}
              />
              <TextField
                label="Last Name"
                fullWidth
                size="small"
                {...register("last_name")}
              />
            </Box>

            <Box className="flex flex-col gap-5">
              <TextField
                label="Organization Name"
                fullWidth
                size="small"
                placeholder="Enter your company name"
                error={!!errors.org_name}
                helperText={errors.org_name?.message}
                {...register("org_name", {
                  required: "Organization Name is required",
                })}
              />
            </Box>

            <Box className="flex flex-col gap-5">
              <TextField
                label="Email"
                type="email"
                fullWidth
                size="small"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              <PasswordField
                label="Password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
              />
              <PasswordField
                label="Confirm Password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Sign Up"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
