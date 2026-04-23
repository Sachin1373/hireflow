import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import api from "@/axiosInstance";
import JobMetaData from "./Steps/JobMetaData";
import ApplicationForm from "./Steps/ApplicationFrom";
import Reviewers from "./Steps/Reviewers";
import Preview from "./Steps/Preview";
import { JobSteps } from "@/utilis";
import JobStepper from "@/Components/JobStepper";

type Step = 0 | 1 | 2 | 3;

export default function CreateNewJob() {
  const [currentStep, setCurrentStep] = useState<Step>(0);
  const [isReviewersStepSaved, setIsReviewersStepSaved] = useState(false);

  const [formData, setFormData] = useState({
    meta: {} as any,
    application: {} as any,
    reviewers: [] as any[],
  });

  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [loadingJob, setLoadingJob] = useState(!!jobId);

  useEffect(() => {
    if (jobId) {
      api
        .get(`/jobs/${jobId}`)
        .then((res) => {
          const job = res.data.data;
          setFormData({
            meta: {
              title: job.title,
              description: job.description,
              jd_content: job.jd_content,
            },
            application: job.fields || [],
            reviewers: job.reviewers || [],
          });
          setIsReviewersStepSaved((job.reviewers || []).length > 0);
        })
        .catch((err) => console.error("Error fetching job details:", err))
        .finally(() => setLoadingJob(false));
    } else {
      setLoadingJob(false);
    }
  }, [jobId]);

  const stepHandlers = useRef<{
    [key in Step]?: () => Promise<boolean>;
  }>({});
  const previewSubmitHandler = useRef<() => void>(() => {});
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as Step);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => (prev - 1) as Step);
  };

  const isStepDone = (stepIdx: Step) => {
    if (stepIdx === 0) return !!formData.meta?.title;
    if (stepIdx === 1) return formData.application && formData.application.length > 0;
    if (stepIdx === 2) return isReviewersStepSaved;
    return false;
  };

  const handleNext = async () => {
    const handler = stepHandlers.current[currentStep];
    const isDone = isStepDone(currentStep);

    // If it's already done (drafted), we navigate next without saving a new record
    // unless update behavior is implemented. For now, just advance.
    if (!isDone && handler) {
      const success = await handler();
      if (!success) return;
      if (currentStep === 2) setIsReviewersStepSaved(true);
    }

    nextStep();
  };

  const handleBack = () => {
    prevStep();
  };

  if (loadingJob) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <JobMetaData
            jobId={jobId}
            data={formData.meta}
            setData={(meta) => setFormData({ ...formData, meta })}
            registerSave={(fn) => (stepHandlers.current[0] = fn)}
          />
        );
      case 1:
        return (
          <ApplicationForm
            jobId={jobId}
            data={formData.application as any}
            setData={(application) => setFormData({ ...formData, application })}
            registerSave={(fn) => (stepHandlers.current[1] = fn)}
          />
        );
      case 2:
        return (
          <Reviewers
            jobId={jobId}
            data={formData.reviewers}
            setData={(reviewers) =>
              setFormData((prev) => ({
                ...prev,
                reviewers:
                  typeof reviewers === "function"
                    ? reviewers(prev.reviewers)
                    : reviewers,
              }))
            }
            onSelectionChange={() => setIsReviewersStepSaved(false)}
            registerSave={(fn) => (stepHandlers.current[2] = fn)}
          />
        );
      case 3:
        return (
          <Preview
            data={formData}
            jobId={jobId}
            registerSubmit={(fn) => {
              previewSubmitHandler.current = fn;
            }}
          />
        );
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
            <Box className="flex gap-8">
              <Button
                variant="contained"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              {currentStep !== 3 ? (
                <Button variant="contained" onClick={handleNext}>
                  {isStepDone(currentStep) ? "Next" : "Save & Next"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => previewSubmitHandler.current?.()}
                >
                  Submit
                </Button>
              )}
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
