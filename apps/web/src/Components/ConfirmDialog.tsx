import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  title: string;
  description: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "error" | "warning";
};

export default function ConfirmDialog({
  open,
  title,
  description,
  loading = false,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { borderRadius: "12px", p: 1, minWidth: 350 },
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6"  sx={{ fontWeight: '700' }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText color="text.secondary">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ gap: 1, px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            color: "text.primary",
            borderColor: "grey.300",
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          color={confirmColor}
          autoFocus
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
