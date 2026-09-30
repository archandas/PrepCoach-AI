import {Router} from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import interviewController from '../controllers/interviewController.js';
import upload from "../middlewares/file.middleware.js"

const interviewRouter = Router();

// Route to generate interview report
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController )

// Route to get interview report by ID
interviewRouter.get("/:interviewId", authMiddleware.authUser,interviewController.getInterviewReportByIdController )

// Route to get all interview reports
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

// Route to generate resume PDF
interviewRouter.post("/resume/pdf/:interviewId", authMiddleware.authUser, interviewController.generateResumePdfController)

export default interviewRouter