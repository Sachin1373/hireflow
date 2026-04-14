import {
  TextField,
  Button,
  Box,
} from "@mui/material";
import PasswordField from "@/Components/PasswordField";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import api from "@/axiosInstance";

export const ROLES = [
  { label: "HR", value: "HR" },
  { label: "Reviewer", value: "Reviewer" },
];

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
  });


  const onSubmit: SubmitHandler<Inputs> = async (payload) => {
    try {
      const res = await api.post("auth/login", payload);
      const accessToken = res.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      toast.success("Account created successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center">
      <Box className="flex w-full md:w-1/2 items-center justify-center px-6">
        <Box className="w-full max-w-md space-y-6">
          <Box>
            <h1 className="text-2xl font-bold">Login to HireFlow</h1>
            <p className="text-gray-500 text-sm">
              Start managing your hiring pipeline
            </p>
          </Box>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
