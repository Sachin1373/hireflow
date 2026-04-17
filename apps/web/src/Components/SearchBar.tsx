import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  placeholder?: string;
  onChange?: (value: string) => void;
  fullWidth?: boolean;
};

export default function SearchBar({ placeholder = "Search...", onChange, fullWidth = false }: Props) {
  return (
    <TextField
      placeholder={placeholder}
      size="small"
      fullWidth={fullWidth}
      onChange={(e) => onChange?.(e.target.value)}
      autoComplete="off"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          sx: {
            borderRadius: "10px",
            backgroundColor: "background.paper",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "grey.50",
            },
            "& fieldset": {
                borderColor: "grey.300",
            }
          },
        },
      }}
    />
  );
}
