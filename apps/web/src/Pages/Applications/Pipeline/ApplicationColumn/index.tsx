import { useEffect, useState } from "react";
import api from "@/axiosInstance";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";

type Application = {
  id: string;
  candidate_name: string;
  candidate_email: string;
};

type Props = {
  title: string;
  jobId: string;
  status: string;
};

const PAGE_SIZE = 10;

export default function ApplicationColumn({ title, jobId, status }: Props) {
  const [data, setData] = useState<Application[]>([]);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    const res = await api.get(
      `applications/jobs/${jobId}/applications?status=${status}`,
    );
    setData(res.data.data || []);
    setPage(1);
  };

  useEffect(() => {
    if (jobId) fetchData();
  }, [jobId, status]);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paginated = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Box
      sx={{
        background: "#f9fafb",
        borderRadius: 2,
        p: 1,
        display: "flex",
        flexDirection: "column",
        border: "2px solid grey",
        height: "100%",
      }}
    >
      {/* HEADER */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "700" }}>{title}</Typography>
        <Chip label={data.length} size="small" />
      </Box>

      <Box 
        sx={{ 
          flex: 1, 
          overflowY: "auto",
          maxHeight: "calc(10 * 72px)",
          mb: 1
        }}
      >
        {paginated.map((item) => (
          <Card
            key={item.id}
            sx={{
              mb: 1,
              border: "1px solid #e5e7eb",
              boxShadow: "none",
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '72px',
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    lineHeight: 1.1,
                    color: "#111827",
                  }}
                >
                  {item.candidate_name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: "#6b7280",
                    lineHeight: 1.1,
                  }}
                >
                  {item.candidate_email}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* PAGINATION */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 1,
          }}
        >
          <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>
            {data.length === 0
              ? "0"
              : `${(page - 1) * PAGE_SIZE + 1} - ${Math.min(
                  page * PAGE_SIZE,
                  data.length,
                )} of ${data.length}`}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{
                border: "1px solid #e5e7eb",
                background: "white",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.4 : 1,
              }}
            >
              {"<"}
            </button>

            <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
              {page} / {totalPages}
            </Typography>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              style={{
                border: "1px solid #e5e7eb",
                background: "white",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.4 : 1,
              }}
            >
              {">"}
            </button>
          </Box>
        </Box>
    </Box>
  );
}