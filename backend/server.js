import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import multer from 'multer';
import cors from "cors";
import notes from "./model/notesModel.js";
import route from "./routes/pdfRouts.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

dotenv.config();

const PORT = 3001;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}).catch(error => console.log(error));

{/*const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const note = new notes({
            name: req.file.originalname.split(".")[0],
            pdf: req.file.buffer,
        });
        await note.save();
        res.status(200).send('PDF saved successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving PDF');
    }
});

*/}

app.use("/api/user",route);
