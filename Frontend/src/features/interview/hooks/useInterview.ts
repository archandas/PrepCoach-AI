import {generateInterviewReport, getInterviewReportById, getAllInterviewReports, generateResumePdf} from "../services/interview.api"
import {useContext, useEffect} from "react"
import {InterviewContext} from "../interview.context"
import {useParams} from "react-router-dom"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const {interviewId} = useParams()
    
    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {loading, setLoading, report, setReport, reports, setReports} = context

   const generateReport = async (
    selfDescription: string,
    jobDescription: string,
    resumeFile: File
    ) => {
    setLoading(true);

    try {
        const response = await generateInterviewReport({
            selfDescription,
            jobDescription,
            resumeFile,
        });

        setReport(response.interviewReport);

        return response.interviewReport;
    } catch (error) {
        console.log("Error generating interview report", error);
        throw error;
    } finally {
        setLoading(false);
    }
    };  

    const getReportById = async (InterviewId:any) => {
        setLoading(true)
        try{
            const response = await getInterviewReportById(InterviewId)
            setReport(response.interviewReport)
            return response.interviewReport;
        } catch(error){
            console.log("Error getting Report", error)
        } finally{
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        try{
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports;
        } catch(error){
            console.log("Error getting Report", error)
        } finally{
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewId: string) => {
        setLoading(true);
        try {
            const pdfBlob = await generateResumePdf(interviewId);
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "resume.pdf";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log("Error generating resume PDF", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(interviewId){
            getReportById(interviewId);
        } else {
            getReports()
        }
    },[interviewId])



    return {loading, report, reports, generateReport, getReportById, getReports, getResumePdf}
}