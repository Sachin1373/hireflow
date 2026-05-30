import { Box, Card, CardContent, Typography, Stack, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function StatCard({ title, value, to }: { title: string; value: string | number; to?: string }) {
  return (
    <Card sx={{ height: "100%", display: "flex", alignItems: "stretch" }}>
      <CardContent sx={{ width: "100%" }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
          {to && (
            <Box sx={{ mt: 1 }}>
              <Button size="small" component={RouterLink} to={to}>
                View
              </Button>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  // Placeholder values for quick dashboard. Replace with API/hooks as needed.
  const stats = [
    { title: "Open Jobs", value: 12, to: "/dashboard/jobs" },
    { title: "Applications", value: 842, to: "/dashboard/applications" },
    { title: "Reviewers", value: 48, to: "/dashboard/reviewers" },
    { title: "Interviews Scheduled", value: 26, to: "/dashboard/interviews" },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">Overview of jobs, applications and reviewers</Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: {
            xs: "repeat(1, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        {stats.map((s) => (
          <Box key={s.title}>
            <StatCard title={s.title} value={s.value} to={s.to} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}