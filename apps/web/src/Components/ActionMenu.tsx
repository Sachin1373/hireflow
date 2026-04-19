import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export type ActionItem = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
  dividerBefore?: boolean;
};

type Props = {
  actions: ActionItem[];
};

export default function ActionMenu({ actions }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          border: "1px solid",
          borderColor: "grey.200",
          borderRadius: "8px",
          "&:hover": { backgroundColor: "grey.50" },
        }}
      >
        <MoreVertIcon fontSize="small" sx={{ color: "text.secondary" }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 2,
            sx: {
              minWidth: 160,
              borderRadius: "10px",
              mt: 1,
              "& .MuiMenuItem-root": {
                fontSize: "0.875rem",
                py: 1,
                px: 2,
                borderRadius: "6px",
                mx: 0.5,
              },
            },
          },
        }}
      >
        {actions.map((action, idx) => (
          <div key={idx}>
            {action.dividerBefore && <Divider sx={{ my: 0.5 }} />}
            <MenuItem
              onClick={() => {
                action.onClick();
                handleClose();
              }}
              sx={{
                color: action.color || "text.primary",
                "&:hover": {
                  backgroundColor: action.color
                    ? `${action.color}08`
                    : "grey.50",
                },
              }}
            >
              <ListItemIcon
                sx={{ color: action.color || "text.secondary", minWidth: 32 }}
              >
                {action.icon}
              </ListItemIcon>
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          </div>
        ))}
      </Menu>
    </>
  );
}
