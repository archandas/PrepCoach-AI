import { useState, useRef } from "react";
import DotField from "../components/DotField";
import { CloudUpload, FileText, X } from "lucide-react";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router-dom";
import Loader from "../../auth/pages/Loader";

export default function Home() {
    const navigate = useNavigate();
    const { loading, generateReport, reports } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef<HTMLInputElement | null>(null);

    const handleGenerateReport = async () => {
        if (!resumeInputRef.current) {
            return;
        }

        const resumeFile = resumeInputRef.current.files?.[0];

        if (!resumeFile) {
            console.log("No resume selected");
            return;
        }

        const data = await generateReport(
            selfDescription,
            jobDescription,
            resumeFile
        );

        navigate(`/interview/${data._id}`);
    };

    const [resume, setResume] = useState<File | null>(null);

    const handleResumeChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setResume(file);
        }
    };

    const removeResume = () => {
        setResume(null);

        // Reset the input so the same file can be selected again
        const input = document.getElementById(
            "resume"
        ) as HTMLInputElement;

        if (input) {
            input.value = "";
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="home text-white bg-[#120F17] relative min-h-screen lg:h-screen w-full flex flex-col lg:flex-row items-center justify-start lg:justify-center gap-5 overflow-y-auto lg:overflow-hidden py-8 lg:py-0">

            {/* Background */}
            <div className="absolute inset-0 z-0">
                <DotField
                    dotRadius={1.5}
                    dotSpacing={14}
                    bulgeStrength={67}
                    glowRadius={160}
                    sparkle={false}
                    waveAmplitude={0}
                    cursorRadius={500}
                    cursorForce={0.1}
                    bulgeOnly
                    gradientFrom="#A855F7"
                    gradientTo="#B497CF"
                    glowColor="#120F17"
                />
            </div>

            <div className="left relative z-10 h-auto lg:h-[90%] min-h-[650px] lg:min-h-0 w-[92%] sm:w-[85%] md:w-[75%] lg:w-[45%] flex flex-col items-center justify-evenly gap-6 lg:gap-0">

                <label
                    className="text-lg font-bold"
                    htmlFor="jobDescription"
                >
                    Job Description
                </label>

                <textarea
                    className="bg-black/30 p-5 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[55%] w-full lg:w-[90%] border-2 border-cyan-400/70 rounded-md focus:outline-none focus:ring-0 resize-none"
                    name="jobDescription"
                    id="jobDescription"
                    placeholder="Enter job description here"
                    onChange={(
                        e: React.ChangeEvent<HTMLTextAreaElement>
                    ) => setJobDescription(e.target.value)}
                ></textarea>

                {/* Display generated reports history if available */}

                {reports.length > 0 && (
                    <div className="w-full lg:w-[90%] mt-2">
                        <h3 className="mb-3 text-lg font-bold text-white">
                            Generated Reports
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[180px] overflow-y-auto pr-1">
                            {reports.map((report: any) => (
                                <div
                                    key={report._id}
                                    onClick={() =>
                                        navigate(
                                            `/interview/${report._id}`
                                        )
                                    }
                                    className="group cursor-pointer rounded-xl border border-white/10 bg-black/30 p-4 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/10 hover:-translate-y-1"
                                >
                                    {/* Report title */}
                                    <h4 className="truncate text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                        {report.title ||
                                            "Untitled Report"}
                                    </h4>

                                    {/* Date */}
                                    <p className="mt-2 text-xs text-gray-400">
                                        {new Date(
                                            report.createdAt
                                        ).toLocaleString()}
                                    </p>

                                    {/* Match Score */}
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">
                                            Match Score
                                        </span>

                                        <span className="text-sm font-bold text-cyan-300">
                                            {report.matchScore ??
                                                "N/A"}
                                            {report.matchScore !=
                                                null && "%"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="right relative z-10 h-auto lg:h-[90%] min-h-[650px] lg:min-h-0 w-[92%] sm:w-[85%] md:w-[75%] lg:w-[45%] flex flex-col items-center justify-evenly gap-8 lg:gap-0">

                <div className="input-group h-[220px] sm:h-[240px] lg:h-[25%] w-full lg:w-[90%] flex flex-col items-center justify-evenly">

                    <p className="text-lg font-bold text-white">
                        Upload Resume
                    </p>

                    <label
                        htmlFor="resume"
                        className="mt-4 flex h-[180px] sm:h-[190px] lg:h-[90%] w-[90%] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-cyan-400/70 relative"
                    >
                        {!resume ? (
                            <>
                                <CloudUpload className="h-7 w-7 text-gray-500" />

                                <p className="text-xs text-gray-400">
                                    PDF only (Max size: 3MB)
                                </p>
                            </>
                        ) : (
                            <>
                                {/* File Icon */}
                                <FileText className="h-8 w-8 text-violet-400" />

                                {/* File Name */}
                                <p className="mt-2 max-w-[80%] truncate text-sm font-medium text-white">
                                    {resume.name}
                                </p>

                                {/* File Size */}
                                <p className="text-xs text-gray-400">
                                    {(resume.size / 1024 / 1024).toFixed(
                                        3
                                    )}{" "}
                                    MB
                                </p>

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeResume();
                                    }}
                                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 hover:text-red-400"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </>
                        )}

                        <input
                            type="file"
                            name="resume"
                            id="resume"
                            accept=".pdf"
                            className="hidden"
                            ref={resumeInputRef}
                            onChange={handleResumeChange}
                        />
                    </label>
                </div>

                <div className="input-group h-[350px] sm:h-[400px] lg:h-[60%] w-full lg:w-[90%] flex flex-col items-center justify-evenly">
                    <p className="text-sm text-gray-400">
                        [*upload both resume and self-description for better results]
                    </p>
                    <label
                        className="text-lg font-bold"
                        htmlFor="selfDescription"
                    >
                        Self Description
                    </label>

                    <textarea
                        className="bg-black/30 p-5 h-[280px] sm:h-[320px] lg:h-[70%] w-full lg:w-[90%] border-2 border-cyan-400/70 rounded-md focus:outline-none focus:ring-0 resize-none"
                        name="selfDescription"
                        id="selfDescription"
                        placeholder="Enter self description here"
                        onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                        ) =>
                            setSelfDescription(e.target.value)
                        }
                    ></textarea>
                </div>

                <button
                    onClick={handleGenerateReport}
                    className="generate-btn h-12 w-full max-w-[280px] sm:w-[280px] bg-cyan-400 text-white font-semibold hover:bg-cyan-500 active:bg-cyan-600 hover:text-[#2e2e2e] transition duration-300 cursor-pointer drop-shadow-[10px_10px_0px_#2e2e2e]"
                >
                    Generate Interview Report
                </button>
            </div>
        </div>
    );
}