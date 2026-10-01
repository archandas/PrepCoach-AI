import InterviewReport from "../models/interviewReport.model.js"
import type { Request, Response } from "express"
import {PDFParse} from 'pdf-parse'
import { generateInterviewReport, generateResumePdf } from "../services/ai.service.js";
import { config } from "dotenv";

async function generateInterviewReportController(req: Request, res: Response){
    console.log(req.body)
    console.log(req.file)
    
    try{
    if (!req.file) {
    return res.status(400).json({ error: 'No resume file uploaded.' });
  }
    const parser = new PDFParse(
    Uint8Array.from(req.file.buffer)
  );
    const resumeContent = await parser.getText()
    await parser.destroy(); //cleans up the parser 

    const {selfDescription,jobDescription} = req.body;

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription
    })

    const interviewReport = await InterviewReport.create({
      user: req.user.id,
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
      ...interviewReportByAi
    })

    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport
    })
  } catch (error: any) {
    console.error("Controller Error:", error.message || error);
    
    // Send a safe error instead of crashing the server
    const statusCode = error?.status || 500;
    res.status(statusCode).json({
      error: "Failed to generate interview report",
      details: error.message || "An unexpected server error occurred."
    });
  }
}

async function getInterviewReportByIdController(req: Request, res: Response){
  const {interviewId} = req.params;

  const interviewReport = await InterviewReport.findOne({_id: interviewId, user: req.user.id })
   
  if(!interviewReport){
    res.status(404).json({message: "Report Not Found"})
  }

  res.status(200).json({
    message: "Report fetched successfully",
  interviewReport
  })

}

async function getAllInterviewReportsController(req: Request, res: Response){
  const interviewReports = await InterviewReport.find({user: req.user.id}).sort({createdAt: -1}).select("-resume, -selfDescription, -jobDescription, -__v, -technicalQuestions, -behavioralQuestions, -skillGaps, -preparationPlan")
  res.status(200).json({
    message: "Reports fetched successfully",
    interviewReports
  })
}

async function generateResumePdfController(req: Request, res: Response){
const {interviewId} = req.params;
const interviewReport = await InterviewReport.findById(interviewId);

if(!interviewReport){
  return res.status(404).json({message: "Report Not Found"})
}

const resume = typeof interviewReport.resume === "string" ? interviewReport.resume : "";
const selfDescription = typeof interviewReport.selfDescription === "string" ? interviewReport.selfDescription : "";
const jobDescription = typeof interviewReport.jobDescription === "string" ? interviewReport.jobDescription : "";

try {
  const pdfBuffer = await generateResumePdf({
    resume,
    selfDescription,
    jobDescription
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="resume_${interviewId}.pdf"`,
  });

  res.send(pdfBuffer);

} catch (error) {
  console.error("RESUME PDF CONTROLLER ERROR:", error);

  res.status(500).json({
    message: "Failed to generate resume PDF"
  });
}

}

export default {generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController}