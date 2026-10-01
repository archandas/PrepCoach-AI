import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import puppeteer from "puppeteer";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

interface userDescriptionProp {
  resume: string;
  jobDescription: string;
  selfDescription: string;
}

interface InterviewReportProp {
  matchScore: number;
  technicalQuestions: {
    question: string;
    intention: string;
    answer: string;
  }[];
  behavioralQuestions: {
    question: string;
    intention: string;
    answer: string;
  }[];
  skillGaps: {
    skill: string;
    severity: "low" | "medium" | "high";
  }[];
  preparationPlan: {
    day: number;
    focus: string;
    tasks: string[];
  }[];
}


const interviewReportJsonSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "number",
      description:
        "The match score of the candidate for the job role, can be between 0 to 100",
    },

    technicalQuestions: {
      type: "array",
      description:
        "A list of technical questions that can be asked during the interview along with their intention and how to answer them",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description:
              "The technical question can be asked during the interview",
          },
          intention: {
            type: "string",
            description:
              "The intention of interviewer behind asking the question",
          },
          answer: {
            type: "string",
            description:
              "How to answer the question, what points to cover, what approach to take, what mistakes to avoid",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },

    behavioralQuestions: {
      type: "array",
      description:
        "A list of behavioral questions that can be asked during the interview along with their intention and how to answer them",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description:
              "The behavioral question can be asked during the interview",
          },
          intention: {
            type: "string",
            description:
              "The intention of interviewer behind asking the question",
          },
          answer: {
            type: "string",
            description:
              "How to answer the question, what points to cover, what approach to take, what mistakes to avoid",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },

    skillGaps: {
      type: "array",
      description:
        "A list of skill gaps that the candidate has along with their severity",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "The skill that the candidate is lacking",
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description:
              "The severity of the skill gap, can be low, medium or high",
          },
        },
        required: ["skill", "severity"],
      },
    },

    preparationPlan: {
      type: "array",
      description:
        "A list of preparation plans for the candidate to follow along with their focus and tasks for each day",
      items: {
        type: "object",
        properties: {
          day: {
            type: "integer",
            description: "The day of the preparation plan",
          },
          focus: {
            type: "string",
            description:
              "The focus of the preparation plan for the day",
          },
          tasks: {
            type: "array",
            description:
              "A list of tasks to be completed on the day of the preparation plan",
            items: {
              type: "string",
            },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },

    title: {
      type: "string",
      description: "The title of the interview report",
    },
  },

  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
    "title",
  ],
};


const interviewReportSchema = z.fromJSONSchema(interviewReportJsonSchema as any);


export async function generateInterviewReport({
  resume,
  jobDescription,
  selfDescription,
}: userDescriptionProp) {
  const prompt = `Generate an interview report for the candidate based on the following information:

Resume:
${resume}

Job Description:
${jobDescription}

Self Description:
${selfDescription}

Return ONLY valid JSON matching the provided schema.
Do not add markdown or any extra text.`;

  let report: InterviewReportProp;

  console.log("🔥 GEMINI REQUEST STARTED:", new Date().toISOString());

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: interviewReportJsonSchema,
      },
    });

    console.log("🔥 GEMINI REQUEST FINISHED:", new Date().toISOString());
    console.log("GEMINI RESPONSE:", response);

    if (!response.text) {
      throw new Error("The model didn't generate any text");
    }

    const parsedOutput = JSON.parse(response.text);

    report = interviewReportSchema.parse(
      parsedOutput
    ) as InterviewReportProp;

  } catch (error) {
    console.error("GEMINI ERROR:", error);
    throw error;
  }

  return report;
}



async function generatePdfFromHtml(htmlContent: string) {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "load",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error("PDF GENERATION ERROR:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}



const resumePdfJsonSchema = {
  type: "object",
  properties: {
    html: {
      type: "string",
      description: "The HTML content of the resume that can be converted to a PDF with Puppeteer"
    }
  }
};

const resumePdfSchema = z.fromJSONSchema(resumePdfJsonSchema as any);

export async function generateResumePdf({resume, jobDescription, selfDescription}: userDescriptionProp) {


const prompt = `Generate a resume in HTML format for the candidate based on the following information:
Resume:
${resume}
Job Description:
${jobDescription}
Self Description:
${selfDescription}
the response should be json object with a single key "html" containing the HTML content of the resume which can be converted to a PDF with Puppeteer.
the resume should be well formatted and visually appealing, with clear sections for the candidate's experience, skills, and education. The resume should be tailored to the job description provided, highlighting the candidate's relevant experience and skills.
the content of resume should be not sound like it's generated by AI, it should be human like and natural. The resume should be in a professional tone and style, and should be free of any grammatical errors or typos. The resume should be concise and to the point, highlighting the candidate's most relevant experience and skills for the job description provided.
you can highlight the content using some colors or different font styles but the overall design should be clean and professional.
the resume should be 1-2 pages long and ATS friendly, meaning that it should be easily readable by applicant tracking systems and should not contain any images or graphics that could interfere with the parsing of the resume. The resume should be in a format that is compatible with most ATS systems, such as a simple text-based format or a PDF format.
`

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumePdfJsonSchema,
    },
  });

  if (!response.text) {
    throw new Error("The model didn't generate any text");
  }

  const parsedOutput = JSON.parse(response.text);
  let resumePdf = resumePdfSchema.parse(parsedOutput) as {html: string};
  const pdfBuffer = await generatePdfFromHtml(resumePdf.html);
  return pdfBuffer;
}