import { Box, Typography, Stack } from "@mui/material";
import { JobSteps } from "@/utilis";
import CheckIcon from '@mui/icons-material/Check';

type Props = {
  currentStep: number;
};

const JobStepper = ({ currentStep }: Props) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: `url('/JobStepper.svg') no-repeat center center`,
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        p: 3,
        borderRadius: '20px'
      }}

    >
      <Stack spacing={4} sx={{ mt: 2 }}>
        {JobSteps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2.5,
              }}
            >
              {/* Step Indicator */}
              <Box
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  backgroundColor: isActive
                    ? "#000"
                    : isCompleted
                    ? "#000"
                    : "transparent",
                  color: isActive || isCompleted ? "#fff" : "#9CA3AF",
                  border: isActive || isCompleted ? "none" : "2px solid #E5E7EB",
                  boxShadow: isActive ? '0 0 0 4px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {isCompleted ? (
                   <CheckIcon sx={{ fontSize: 18 }} />
                ) : (
                  index + 1
                )}
              </Box>

              {/* Text */}
              <Box sx={{ mt: 0.5 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: isActive ? 700 : 600,
                    lineHeight: 1.2,
                    color: isActive ? "#000" : isCompleted ? "#4B5563" : "#9CA3AF",
                    transition: 'all 0.3s ease'
                  }}
                >
                  {step.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '13px',
                    color: isActive ? "#4B5563" : "#9CA3AF",
                    mt: 0.5,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default JobStepper;