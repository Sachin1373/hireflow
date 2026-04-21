import { useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import {
  Editor,
  EditorProvider,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnBulletList,
  BtnNumberedList,
} from "react-simple-wysiwyg";
import api from "@/axiosInstance";
import { toast } from "react-toastify";

type JobMetaDataType = {
  title?: string;
  description?: string;
  jd_content?: string;
};

type Props = {
  data: JobMetaDataType;
  setData: (data: JobMetaDataType) => void;
  registerSave: (fn: () => Promise<boolean>) => void;
};

const JobMetaData = ({ data, setData, registerSave }: Props) => {
  useEffect(() => {
    registerSave(async () => {
      try {
        await api.post('/jobs/create', data)
        toast.success("User removed successfully");
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    });
  }, [data]);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <TextField
        label="Job Title"
        fullWidth
        value={data.title || ""}
        onChange={(e) => setData({ ...data, title: e.target.value })}
      />

      <TextField
        label="Short Description"
        fullWidth
        multiline
        rows={3}
        value={data.description || ""}
        onChange={(e) => setData({ ...data, description: e.target.value })}
      />

      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Job Description (JD)
        </Typography>

        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
             overflow: "hidden",
            "& .rsw-editor": {
              height: 350, 
              padding: "8px",
              overflowY: "auto",
            },
          }}
        >
          <EditorProvider>
            <Editor
              value={data.jd_content || ""}
              onChange={(e) => setData({ ...data, jd_content: e.target.value })}
            >
              <Toolbar>
                <BtnBold />
                <BtnItalic />
                <BtnUnderline />
                <BtnBulletList />
                <BtnNumberedList />
              </Toolbar>
            </Editor>
          </EditorProvider>
        </Box>
      </Box>
    </Box>
  );
};

export default JobMetaData;
