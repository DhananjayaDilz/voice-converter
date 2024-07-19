import mongoose, { Schema } from "mongoose";


const pdfSchema=new mongoose.Schema({
   pdfName:{ type:String,
    required: true}
})


export default mongoose.model("pdf",pdfSchema);

