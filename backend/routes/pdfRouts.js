import express  from "express";
import { addNote, create } from "../controller/userController.js";

const route=express.Router();

route.post("/create",create);
route.post("/addnote",addNote);

export default route;