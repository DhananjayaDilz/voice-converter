import express  from "express";
import { addNote, create, getPDFs } from "../controller/userController.js";

const route=express.Router();

route.post("/create",create);
route.post("/addnote",addNote);
route.get("/pdfs",getPDFs);

export default route;