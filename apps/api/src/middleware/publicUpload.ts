import fs from "fs";
import path from "path";
import multer from "multer";

const uploadRoot = path.resolve(__dirname, "../../../uploads/resumes");
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 60);
    cb(null, `${Date.now()}_${safeBase}${ext}`);
  },
});

const allowedExts = new Set([".pdf", ".doc", ".docx"]);

export const publicUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExts.has(ext)) {
      cb(new Error("Only .pdf, .doc, .docx files are allowed"));
      return;
    }
    cb(null, true);
  },
});
