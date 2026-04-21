import React, { useState, useRef   } from "react";
import { Box, Typography, Container, Stack, Button } from "@mui/material";
import JobMetaData from "./Steps/JobMetaData";
import ApplicationForm from "./Steps/ApplicationFrom";
import Reviewers from "./Steps/Reviewers";
import Preview from "./Steps/Preview";
import { JobSteps } from "@/utilis";
import JobStepper from "@/Components/JobStepper";

type Step = 0 | 1 | 2 | 3;

export default function CreateNewJob() {
  const [currentStep, setCurrentStep] = useState<Step>(0);

  const [formData, setFormData] = useState({
    meta: {},
    application: {},
    reviewers: [],
  });

  const stepHandlers = useRef<{
    [key in Step]?: () => Promise<boolean>;
  }>({});
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as Step);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => (prev - 1) as Step);
  };

  const handleNext = async () => {
    const handler = stepHandlers.current[currentStep];
    if (handler) {
      const success = await handler();
      if (!success) return;
    }

    nextStep();
  };

  const handleBack = () => {
    prevStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <JobMetaData
            data={formData.meta}
            setData={(meta) => setFormData({ ...formData, meta })}
            registerSave={(fn) => (stepHandlers.current[0] = fn)}
          />
        );
      case 1:
        return <ApplicationForm data={formData.application} />;
      case 2:
        return <Reviewers data={formData.reviewers} />;
      case 3:
        return <Preview data={formData} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Left Content Area */}
      <Box sx={{ width: "75%", display: "flex", flexDirection: "column" }}>
        <Container sx={{ m: 0 }}>
          <Stack spacing={1} sx={{ mb: 4 }}>
            <Typography
              variant="overline"
              sx={{ color: "#666", fontWeight: 600, letterSpacing: 1.2 }}
            >
              STEP {currentStep + 1} OF {JobSteps.length}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#111" }}>
              {JobSteps[currentStep].title}
            </Typography>
            <Typography variant="body1" sx={{ color: "#666" }}>
              {JobSteps[currentStep].description}
            </Typography>
          </Stack>

          <Box sx={{ mt: 2 }}>{renderStep()}</Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 6,
            }}
          >
            <Box>
              <Button variant="contained">Cancel</Button>
            </Box>
            <Box className='flex gap-8'>
              <Button variant="contained" onClick={handleBack}>Back</Button>
              <Button variant="contained" onClick={handleNext}>Save & Next</Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ width: "25%" }} className="mb-12">
        <JobStepper currentStep={currentStep} />
      </Box>
    </Box>
  );
}
