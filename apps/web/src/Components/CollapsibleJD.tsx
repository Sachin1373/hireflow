import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Paper,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { useState } from "react";

type Props = {
  jdContent: string;
};

const CollapsibleJD = ({ jdContent }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        overflow: "hidden",
        mb: 4,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: expanded ? "1px solid #e5e7eb" : "none",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          Job Description
        </Typography>

        <IconButton
          onClick={() => setExpanded(!expanded)}
          sx={{
            border: "1px solid #e5e7eb",
          }}
        >
          {expanded ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </IconButton>
      </Box>

      {/* CONTENT */}
      <Box sx={{ px: 3, py: 2 }}>
        {/* COLLAPSED VIEW */}
        {!expanded && (
          <Box
            sx={{
              maxHeight: 120,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              dangerouslySetInnerHTML={{
                __html: jdContent,
              }}
              sx={{
                "& span": {
                  fontSize: "15px !important",
                  color: "#374151 !important",
                  fontFamily: "inherit !important",
                  lineHeight: 1.8,
                },
              }}
            />

            {/* fade effect */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 50,
                background:
                  "linear-gradient(to bottom, transparent, white)",
              }}
            />
          </Box>
        )}

        {/* EXPANDED VIEW */}
        <Collapse in={expanded}>
          <Box
            dangerouslySetInnerHTML={{
              __html: jdContent,
            }}
            sx={{
              "& span": {
                fontSize: "15px !important",
                color: "#374151 !important",
                fontFamily: "inherit !important",
                lineHeight: 1.8,
              },
            }}
          />
        </Collapse>
      </Box>
    </Paper>
  );
};

export default CollapsibleJD;