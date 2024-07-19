import mongoose, { Schema } from "mongoose";

const notesSchema=new mongoose.Schema({
    name: String,
    pdf:Buffer,
})
export default mongoose.model("notes",notesSchema);