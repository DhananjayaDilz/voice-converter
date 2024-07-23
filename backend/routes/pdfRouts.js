import express  from "express";
import { addNote, create, getPDFs, uploadPDF } from "../controller/userController.js";
import multer from 'multer';


const route=express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
route.post("/create",create);
route.post("/addnote",addNote);
route.get("/pdfs",getPDFs);
route.post("/upload", upload.single('file'),uploadPDF);

export default route;