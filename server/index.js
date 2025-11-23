import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";

const app = express();


const queue = new Queue("file-upload",{
  connection:{
    host:"localhost",
    port:6379,
    password:"ITSMEBBy"
  }
});

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSufffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSufffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  return res.json({ status: "all good bby" });
});

app.post("/upload/pdf", upload.single("pdf"), async(req, res) => {

  await queue.add("file-ready",{
    filename:req.file.originalname,
    destination:req.file.destination,
    path:req.file.path
  })



  

  console.log("upload the given pdf file :)");
});

app.listen(8000, () => {
  console.log("server started...");
});
