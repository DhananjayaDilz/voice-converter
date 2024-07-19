import express, { Router } from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import route from "./routes/pdfRouts.js";
//import route from "./routes/userRoute.js"
import notes from "./model/notesModel.js";
import multer from 'multer';
import  fs from  'fs';
import  path from 'path';
import cors from "cors";

const app = express ();   
app.use(bodyParser.json());

dotenv.config();

const PORT =  3001;
const MONGOURL = process.env.MONGO_URL; 

mongoose.connect(MONGOURL).then(()=>{
    console.log("Database connected Successfully.")
    app.listen(PORT, ()=>{
        console.log(`Server is running on port : ${PORT}`)
    })
}).catch(error => console.log(error));



app.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const note = new notes({
            name: req.file.originalname,
            pdf: req.file.buffer,
        });
        await note.save();
        res.status(200).send('PDF saved successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving PDF');
    }
});

app.use("/api/pdf",route);