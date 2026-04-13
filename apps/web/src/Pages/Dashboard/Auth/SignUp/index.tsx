import { TextField, Button, MenuItem, Box } from "@mui/material";

export const ROLES = [
  { label: "HR", value: "HR" },
  { label: "Reviewer", value: "Reviewer" },
];

const SignUp = () => {
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

          <form className="space-y-4">
            <Box className="flex gap-4">
              <TextField label="First Name" fullWidth size="small" />
              <TextField label="Last Name" fullWidth size="small" />
            </Box>

            <Box className="flex flex-col gap-5">
              <TextField label="Email" type="email" fullWidth size="small" />

              <TextField
                select
                label="Role"
                fullWidth
                size="small"
                defaultValue=""
              >
                {ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Button variant="contained" fullWidth size="large">
              Sign Up
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
