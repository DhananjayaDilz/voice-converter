import notes from "../model/notesModel.js";
import pdf from "../model/pdfModel.js";

export const create=async(req,res)=>{
    try {
        const pdfData=new pdf(req.body);
         const {data}=pdfData;
         const pdfExist=await pdf.findOne({data});
         if (pdfExist) {
            return res.status(200).json({message:"pdf exist"})
         }

         const savedPdf=await pdfData.save();
         res.status(200).json(savedPdf);
    } catch (error) {
        res.status(500).json({error:"internal server error"});
    }
}

export const addNote= async(req,res)=>{
    try {
        const note=new notes(req.body);
        const {data}=note;
        const noteExist=notes.findOne({data});
        

        const saveNote=await note.save();
        res.status(200).json(saveNote);
    } catch (error) {
        res.status(500).json({error:"INTERNAL SERVER ERROR"})
    }
}

export const uploadPDF= async(req,res)=>{
    
}