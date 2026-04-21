import { AppBar, Toolbar, Box, Avatar, IconButton, Typography, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import api from "@/axiosInstance";

export default function NavBar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error(err);
  } finally {
    dispatch(logout());
    navigate("/login", { replace: true });
  }
};

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <Box className="flex items-center gap-4">
          {user && (
            <Box className="text-right">
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.role}
              </Typography>
            </Box>
          )}

          <IconButton>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "black" }}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </Avatar>
          </IconButton>

          <Button 
            size="small" 
            variant="outlined" 
            color="inherit" 
            onClick={handleLogout}
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}