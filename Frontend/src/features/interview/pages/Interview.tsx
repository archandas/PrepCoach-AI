import React, { useState, useEffect } from "react";
import {useInterview} from "../hooks/useInterview"
import {useAuth} from "../../auth/hooks/useAuth"
import {useNavigate, useParams,Link} from "react-router-dom"
import { toast } from "react-hot-toast";
import AiLoader from "./AiLoader";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "../../../../@/components/ui/dialog";

import {
    Brain,
    ChevronDown,
    ChevronRight,
    Code2,
    ListChecks,
    Map,
    MessageSquare,
    PanelLeft,
    Target,
    Trophy,
    Download,
    LogOut,
    UserRound
} from "lucide-react";



// SIDEBAR

type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
    collapsible?: "icon" | "offcanvas" | "none";
};

type SidebarContextType = {
    open: boolean;
    toggleSidebar: () => void;
};

const SidebarContext =
    React.createContext<SidebarContextType | null>(null);


function useSidebar() {
    const context = React.useContext(SidebarContext);

    if (!context) {
        throw new Error(
            "useSidebar must be used inside SidebarProvider"
        );
    }

    return context;
}


// SIDEBAR PROVIDER

function SidebarProvider({
    className = "",
    defaultOpen = true,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean;
}) {

    const [open, setOpen] = useState(defaultOpen);

    const toggleSidebar = () => {
        setOpen((previous) => !previous);
    };

    return (
        <SidebarContext.Provider
            value={{
                open,
                toggleSidebar,
            }}
        >
            <div
                className={`min-h-screen ${className}`}
                {...props}
            >
                {children}
            </div>
        </SidebarContext.Provider>
    );
}


// SIDEBAR

function Sidebar({
    className = "",
    children,
    collapsible = "icon",
    ...props
}: SidebarProps) {

    const { open } = useSidebar();

    if (collapsible === "none") {
        return (
            <aside
                className={className}
                {...props}
            >
                {children}
            </aside>
        );
    }

    return (
        <aside
            className={`
                fixed
                inset-y-0
                left-0
                z-50
                h-screen
                overflow-visible
                border-r
                border-white/10
                bg-[#15121C]
                shadow-2xl
                shadow-black/30
                transition-[width]
                duration-300
                ease-in-out

                ${open ? "w-64" : "w-0"}

                ${className}
            `}
            {...props}
        >

            {children}


            {/* 
                COLLAPSED SIDEBAR TRIGGER
                This is visible ONLY when sidebar is closed.
            */}

            {!open && (
                <div
                    className="
                        absolute
                        left-3
                        top-3
                    "
                >
                    <SidebarTrigger className="cursor-pointer"/>
                </div>
            )}

        </aside>
    );
}


// SIDEBAR CONTENT

function SidebarContent({
    className = "",
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {

    const { open } = useSidebar();

    return (
        <div
            className={`
                h-full
                w-64
                overflow-hidden
                transition-opacity
                duration-200
                ${open
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }
                ${className}
            `}
            {...props}
        />
    );
}


// SIDEBAR GROUP

function SidebarGroup({
    className = "",
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {

    return (
        <div
            className={className}
            {...props}
        />
    );
}


// SIDEBAR GROUP CONTENT

function SidebarGroupContent({
    className = "",
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {

    return (
        <div
            className={className}
            {...props}
        />
    );
}


// SIDEBAR GROUP LABEL

function SidebarGroupLabel({
    className = "",
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {

    return (
        <div
            className={className}
            {...props}
        />
    );
}


// SIDEBAR MENU

function SidebarMenu({
    className = "",
    ...props
}: React.HTMLAttributes<HTMLUListElement>) {

    return (
        <ul
            className={className}
            {...props}
        />
    );
}


// SIDEBAR MENU ITEM

function SidebarMenuItem({
    className = "",
    ...props
}: React.HTMLAttributes<HTMLLIElement>) {

    return (
        <li
            className={className}
            {...props}
        />
    );
}


// SIDEBAR MENU BUTTON

function SidebarMenuButton({
    className = "",
    isActive,
    tooltip: _tooltip,
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isActive?: boolean;
    tooltip?: string;
}) {

    return (
        <button
            type="button"
            data-active={isActive}
            title={_tooltip}
            className={`
                flex
                w-full
                items-center
                gap-3
                rounded-md
                px-3
                transition-all
                duration-200

                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
}


// SIDEBAR TRIGGER

function SidebarTrigger({
    className = "",
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {

    const { toggleSidebar } = useSidebar();

    return (
        <button
            type="button"
            aria-label="Toggle sidebar"
            onClick={toggleSidebar}
            className={`
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-md
                text-gray-400
                transition-all
                duration-200
                hover:bg-white/[0.06]
                hover:text-white

                ${className}
            `}
            {...props}
        >
            <PanelLeft className="h-[18px] w-[18px]" />
        </button>
    );
}


// TYPES

interface TechnicalQuestion {
    question: string;
    intention: string;
    answer: string;
}

interface BehavioralQuestion {
    question: string;
    intention: string;
    answer: string;
}

interface SkillGap {
    skill: string;
    severity: "low" | "medium" | "high";
}

interface PreparationDay {
    day: number;
    focus: string;
    tasks: string[];
}

interface InterviewReportData {
    matchScore: number;
    technicalQuestions: TechnicalQuestion[];
    behavioralQuestions: BehavioralQuestion[];
    skillGaps: SkillGap[];
    preparationPlan: PreparationDay[];
}


// MAIN COMPONENT

export default function Interview() {

    const {report, getReportById, loading, getResumePdf} = useInterview()
    const {interviewId} = useParams()

    const {user, handleLogout} = useAuth()
    const navigate = useNavigate()

    const handleUserLogout = async () => {
        try{
            await handleLogout()
            toast.success("Logged out successfully")
            navigate('/login')
        } catch(err){
            toast.error("Error occurred while logging out, try again later")
            console.error("Error occurred while logging out")
        }
    }

    useEffect(() => {
        if(interviewId){
            getReportById(interviewId)
        }
    }, [interviewId])

    const [activeSection, setActiveSection] =
        useState<
            "technical" | "behavioral" | "roadmap"
        >("technical");

        if(loading || !report){
            return (
                <AiLoader/>
            )
        }
    return (

        <SidebarProvider
            defaultOpen={true}
            className="
                min-h-screen
                bg-[#120F17]
                text-white
            "
        >

            <div
                className="
                    min-h-screen
                    w-full
                    bg-[#120F17]
                "
            >


                {/* 
                    OVERLAY SIDEBAR
                 */}

                <Sidebar
                    collapsible="icon"
                >

                    <SidebarContent>

                        {/* 
                            SIDEBAR HEADER
                         */}

                        <div
                            className="
                                relative
                                flex
                                h-14
                                items-center
                                border-b
                                border-white/10
                                px-4
                            "
                        >

                            <Link to="/">
                            <Brain
                                className="
                                    h-5
                                    w-5
                                    shrink-0
                                    text-cyan-400
                                "
                            />
                            </Link>

                            <Link to="/">
                            <span
                                className="
                                    ml-3
                                    whitespace-nowrap
                                    text-sm
                                    font-semibold
                                    cursor-pointer
                                "
                            >
                                PrepCoach AI
                            </span>
                            </Link>

                            {/* Collapse button */}

                            <SidebarTrigger
                                className="
                                    absolute
                                    right-3
                                    top-3
                                    cursor-pointer
                                "
                            />

                        </div>


                        {/* 
                            SECTIONS
                         */}

                        <SidebarGroup
                            className="pt-5"
                        >

                            <SidebarGroupLabel
                                className="
                                    px-4
                                    text-[10px]
                                    uppercase
                                    tracking-[0.2em]
                                    text-gray-500
                                "
                            >
                                Sections
                            </SidebarGroupLabel>


                            <SidebarGroupContent>

                                <SidebarMenu
                                    className="
                                        mt-3
                                        px-2
                                    "
                                >


                                    {/* 
                                        TECHNICAL
                                     */}

                                    <SidebarMenuItem>

                                        <SidebarMenuButton
                                            onClick={() =>
                                                setActiveSection(
                                                    "technical"
                                                )
                                            }
                                            isActive={
                                                activeSection ===
                                                "technical"
                                            }
                                            tooltip="Technical Questions"
                                            className="
                                                h-10
                                                text-gray-400
                                                hover:bg-violet-500/10
                                                hover:text-violet-300
                                                data-[active=true]:bg-violet-500/15
                                                data-[active=true]:text-violet-300
                                                cursor-pointer
                                            "
                                        >

                                            <Code2
                                                className="
                                                    h-4
                                                    w-4
                                                    shrink-0
                                                "
                                            />

                                            <span>
                                                Technical Questions
                                            </span>

                                        </SidebarMenuButton>

                                    </SidebarMenuItem>


                                    {/* 
                                        BEHAVIORAL
                                     */}

                                    <SidebarMenuItem>

                                        <SidebarMenuButton
                                            onClick={() =>
                                                setActiveSection(
                                                    "behavioral"
                                                )
                                            }
                                            isActive={
                                                activeSection ===
                                                "behavioral"
                                            }
                                            tooltip="Behavioral Questions"
                                            className="
                                                h-10
                                                text-gray-400
                                                hover:bg-violet-500/10
                                                hover:text-violet-300
                                                data-[active=true]:bg-violet-500/15
                                                data-[active=true]:text-violet-300
                                                cursor-pointer
                                            "
                                        >

                                            <MessageSquare
                                                className="
                                                    h-4
                                                    w-4
                                                    shrink-0
                                                "
                                            />

                                            <span>
                                                Behavioral Questions
                                            </span>

                                        </SidebarMenuButton>

                                    </SidebarMenuItem>


                                    {/* 
                                        ROAD MAP
                                     */}

                                    <SidebarMenuItem>

                                        <SidebarMenuButton
                                            onClick={() =>
                                                setActiveSection(
                                                    "roadmap"
                                                )
                                            }
                                            isActive={
                                                activeSection ===
                                                "roadmap"
                                            }
                                            tooltip="Road Map"
                                            className="
                                                h-10
                                                text-gray-400
                                                hover:bg-violet-500/10
                                                hover:text-violet-300
                                                data-[active=true]:bg-violet-500/15
                                                data-[active=true]:text-violet-300
                                                cursor-pointer
                                            "
                                        >

                                            <Map
                                                className="
                                                    h-4
                                                    w-4
                                                    shrink-0
                                                "
                                            />

                                            <span>
                                                Road Map
                                            </span>

                                        </SidebarMenuButton>

                                    </SidebarMenuItem>


                                </SidebarMenu>

                            </SidebarGroupContent>

                        </SidebarGroup>

                        {/* SIDEBAR ACTIONS */}
                      <div
                          className="
                              absolute
                              bottom-0
                              left-0
                              w-full
                              border-t
                              border-white/10
                              p-3
                              space-y-2
                          "
                      >
                          {/* Download PDF */}
                          <button
                              onClick={() => getResumePdf(interviewId!)}
                              className="
                                  flex
                                  w-full
                                  items-center
                                  justify-center
                                  gap-2
                                  rounded-md
                                  bg-violet-500
                                  px-4
                                  py-2
                                  text-sm
                                  font-medium
                                  text-white
                                  transition-all
                                  duration-200
                                  hover:bg-violet-600
                                  hover:shadow-lg
                                  hover:shadow-violet-500/20
                                  cursor-pointer
                              "
                          >
                              <Download className="h-4 w-4 animate-bounce" />
                              Download Resume PDF
                          </button>
                          {/* User Profile */}
                          <Dialog>
                          <DialogTrigger
                              render={
                                  <button
                                      type="button"
                                      className="
                                          flex
                                          w-full
                                          items-center
                                          justify-center
                                          gap-2
                                          rounded-md
                                          border
                                          border-white/10
                                          bg-white/[0.03]
                                          px-4
                                          py-2
                                          text-sm
                                          font-medium
                                          text-gray-300
                                          transition-all
                                          duration-200
                                          hover:border-violet-400/30
                                          hover:bg-violet-500/10
                                          hover:text-violet-300
                                          cursor-pointer
                                      "
                                  >
                                      <UserRound className="h-4 w-4" />
                                      My Account
                                  </button>
                              }
                          />
                  
                          <DialogContent
                              className="
                                  w-[calc(100%-2rem)]
                                  max-w-md
                                  border
                                  border-white/10
                                  bg-[#15121C]
                                  text-white
                                  shadow-2xl
                                  shadow-black/50
                              "
                          >
                              <DialogHeader className="items-center text-center">
                  
                                  {/* Avatar */}
                                  <div
                                      className="
                                          mb-4
                                          flex
                                          h-24
                                          w-24
                                          items-center
                                          justify-center
                                          rounded-full
                                          border
                                          border-violet-400/30
                                          bg-violet-500/10
                                          shadow-lg
                                          shadow-violet-500/10
                                      "
                                  >
                                      <UserRound
                                          className="
                                              h-12
                                              w-12
                                              text-violet-400
                                          "
                                      />
                                  </div>
                  
                                  <DialogTitle className="text-xl font-semibold text-white">
                                      My Account
                                  </DialogTitle>
                  
                                  <DialogDescription className="text-gray-500">
                                      Your account information
                                  </DialogDescription>
                  
                              </DialogHeader>
                  
                  
                              {/* User Information */}
                              <div className="mt-5 space-y-3">
                  
                                  {/* Username */}
                                  <div
                                      className="
                                          rounded-lg
                                          border
                                          border-white/10
                                          bg-white/[0.03]
                                          px-4
                                          py-3
                                      "
                                  >
                                      <p
                                          className="
                                              mb-1
                                              text-[10px]
                                              font-bold
                                              uppercase
                                              tracking-widest
                                              text-gray-500
                                          "
                                      >
                                          Username
                                      </p>
                  
                                      <p className="text-sm font-medium text-gray-200">
                                          {user?.username || "Unknown user"}
                                      </p>
                                  </div>
                  
                  
                                  {/* Email */}
                                  <div
                                      className="
                                          rounded-lg
                                          border
                                          border-white/10
                                          bg-white/[0.03]
                                          px-4
                                          py-3
                                      "
                                  >
                                      <p
                                          className="
                                              mb-1
                                              text-[10px]
                                              font-bold
                                              uppercase
                                              tracking-widest
                                              text-gray-500
                                          "
                                      >
                                          Email
                                      </p>
                  
                                      <p className="break-all text-sm font-medium text-gray-200">
                                          {user?.email || "No email available"}
                                      </p>
                                  </div>
                  
                              </div>
                          </DialogContent>
                      </Dialog>

                          {/* Logout */}
                          <button
                            onClick={handleUserLogout}
                            className="
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-md
                                border
                                border-red-400/20
                                bg-red-400/5
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-red-300
                                transition-all
                                duration-200
                                hover:border-red-400/30
                                hover:bg-red-400/10
                                hover:text-red-200
                                cursor-pointer
                            "
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                      </div>

                    </SidebarContent>

                </Sidebar>


                {/* 
                    MAIN AREA
                 */}

                <main
                    className="
                        min-h-screen
                        w-full
                        bg-[#120F17]
                    "
                >


                    {/* 
                        TOP BAR
                     */}

                    <header
                        className="
                            flex
                            h-14
                            shrink-0
                            items-center
                            border-b
                            border-white/10
                            bg-[#120F17]/80
                            px-4
                            backdrop-blur-md
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                           <Link to="/">
                            <Brain
                                className="
                                    ml-10
                                    h-6
                                    w-6
                                    text-cyan-400
                                    cursor-pointer
                                "
                            />
                            </Link>

                            <span
                                className="
                                    text-sm
                                    font-semibold
                                "
                            >
                                AI Interview Report
                            </span>

                        </div>

                    </header>


                    {/* 
                        CONTENT + RIGHT PANEL
                     */}

                    <div
                        className="
                            flex
                            flex-col
                            lg:flex-row
                        "
                    >


                        {/* 
                            RIGHT PANEL

                            MOBILE:
                            TOP

                            DESKTOP:
                            RIGHT
                         */}

                        <aside
                            className="
                                order-first
                                w-full
                                shrink-0
                                border-b
                                border-white/10
                                bg-[#15121C]/70
                                p-5

                                lg:order-last
                                lg:w-[280px]
                                lg:border-b-0
                                lg:border-l
                            "
                        >

                            <div
                                className="
                                    lg:sticky
                                    lg:top-5
                                "
                            >

                                <MatchScore
                                    score={
                                        report.matchScore
                                    }
                                />


                                <div
                                    className="
                                        my-6
                                        h-px
                                        bg-white/10
                                    "
                                />


                                <SkillGaps
                                    skillGaps={
                                        report.skillGaps
                                    }
                                />

                            </div>

                        </aside>


                        {/* 
                            CENTER CONTENT
                         */}

                        <section
                            className="
                                order-last
                                min-w-0
                                flex-1
                                p-4
                                sm:p-6

                                lg:order-first
                            "
                        >

                            {/* Technical */}

                            {activeSection === "technical" && (

                                <QuestionSection
                                    title="Technical Questions"
                                    icon={
                                        <Code2
                                            className="
                                                h-5
                                                w-5
                                            "
                                        />
                                    }
                                    questions={
                                        report.technicalQuestions
                                    }
                                />

                            )}


                            {/* Behavioral */}

                            {activeSection === "behavioral" && (

                                <QuestionSection
                                    title="Behavioral Questions"
                                    icon={
                                        <MessageSquare
                                            className="
                                                h-5
                                                w-5
                                            "
                                        />
                                    }
                                    questions={
                                        report.behavioralQuestions
                                    }
                                />

                            )}


                            {/* Road Map */}

                            {activeSection === "roadmap" && (

                                <RoadMap
                                    preparationPlan={
                                        report.preparationPlan
                                    }
                                />

                            )}

                        </section>

                    </div>

                </main>

            </div>

        </SidebarProvider>
    );
}


// QUESTION SECTION

function QuestionSection({
    title,
    icon,
    questions,
}: {
    title: string;
    icon: React.ReactNode;
    questions: {
        question: string;
        intention: string;
        answer: string;
    }[];
}) {

    const [openQuestion, setOpenQuestion] =
        useState<number>(0);


    return (

        <div
            className="
                mx-auto
                w-full
                max-w-4xl
            "
        >


            {/* 
                HEADING
             */}

            <div
                className="
                    mb-5
                    flex
                    items-center
                    justify-between
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-violet-500/10
                            text-violet-400
                        "
                    >
                        {icon}
                    </div>


                    <div
                        className="
                            min-w-0
                        "
                    >

                        <h1
                            className="
                                text-lg
                                font-bold
                            "
                        >
                            {title}
                        </h1>

                        
                        <p
                            className="
                                text-xs
                                text-gray-500
                            "
                        >
                            AI generated interview questions
                        </p>

                    </div>

                </div>


                <span
                    className="
                        shrink-0
                        rounded-full
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-3
                        py-1
                        text-xs
                        text-gray-400
                    "
                >
                    {questions.length} questions
                </span>

            </div>


            {/* 
                QUESTIONS
             */}

            <div className="space-y-3">

                {questions.map(
                    (item, index) => {

                        const isOpen =
                            openQuestion === index;


                        return (

                            <div
                                key={index}
                                className="
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-[#181520]/90
                                    shadow-lg
                                    shadow-black/10
                                "
                            >


                                {/* 
                                    QUESTION HEADER
                                 */}

                                <button
                                    onClick={() =>
                                        setOpenQuestion(
                                            isOpen
                                                ? -1
                                                : index
                                        )
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-start
                                        gap-3
                                        p-4
                                        text-left
                                        transition
                                        hover:bg-white/[0.03]
                                    "
                                >

                                    <span
                                        className="
                                            mt-0.5
                                            shrink-0
                                            rounded-md
                                            bg-violet-500/10
                                            px-2
                                            py-1
                                            text-[10px]
                                            font-bold
                                            text-violet-400
                                        "
                                    >
                                        Q
                                        {String(
                                            index + 1
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                    </span>


                                    <span
                                        className="
                                            flex-1
                                            text-sm
                                            font-medium
                                            leading-6
                                            text-gray-200
                                        "
                                    >
                                        {item.question}
                                    </span>


                                    {isOpen ? (

                                        <ChevronDown
                                            className="
                                                mt-1
                                                h-4
                                                w-4
                                                shrink-0
                                                text-violet-400
                                            "
                                        />

                                    ) : (

                                        <ChevronRight
                                            className="
                                                mt-1
                                                h-4
                                                w-4
                                                shrink-0
                                                text-gray-500
                                            "
                                        />

                                    )}

                                </button>


                                {/* 
                                    EXPANDED CONTENT
                                 */}

                                {isOpen && (

                                    <div
                                        className="
                                            border-t
                                            border-white/10
                                            px-4
                                            pb-5
                                            pt-4
                                        "
                                    >


                                        {/* 
                                            INTENTION
                                         */}

                                        <div
                                            className="
                                                mb-5
                                            "
                                        >

                                            <div
                                                className="
                                                    mb-2
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                <Target
                                                    className="
                                                        h-3.5
                                                        w-3.5
                                                        text-cyan-400
                                                    "
                                                />


                                                <span
                                                    className="
                                                        text-[10px]
                                                        font-bold
                                                        uppercase
                                                        tracking-wider
                                                        text-cyan-400
                                                    "
                                                >
                                                    Intention
                                                </span>

                                            </div>


                                            <p
                                                className="
                                                    text-sm
                                                    leading-6
                                                    text-gray-400
                                                "
                                            >
                                                {
                                                    item.intention
                                                }
                                            </p>

                                        </div>


                                        {/* 
                                            MODEL ANSWER
                                         */}

                                        <div>

                                            <div
                                                className="
                                                    mb-2
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                <Brain
                                                    className="
                                                        h-3.5
                                                        w-3.5
                                                        text-emerald-400
                                                    "
                                                />


                                                <span
                                                    className="
                                                        text-[10px]
                                                        font-bold
                                                        uppercase
                                                        tracking-wider
                                                        text-emerald-400
                                                    "
                                                >
                                                    Model Answer
                                                </span>

                                            </div>


                                            <p
                                                className="
                                                    text-sm
                                                    leading-6
                                                    text-gray-400
                                                "
                                            >
                                                {
                                                    item.answer
                                                }
                                            </p>

                                        </div>

                                    </div>

                                )}

                            </div>

                        );

                    }
                )}

            </div>

        </div>

    );
}


// ROAD MAP

function RoadMap({
    preparationPlan,
}: {
    preparationPlan: PreparationDay[];
}) {

    return (

        <div
            className="
                mx-auto
                w-full
                max-w-4xl
            "
        >


            {/* 
                HEADING
             */}

            <div
                className="
                    mb-6
                    flex
                    items-center
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-cyan-400/10
                        text-cyan-400
                    "
                >
                    <Map className="h-5 w-5" />
                </div>


                <div>

                    <h1 className="text-lg font-bold">
                        Preparation Road Map
                    </h1>


                    <p className="text-xs text-gray-500">
                        Your personalized interview preparation plan
                    </p>

                </div>

            </div>


            {/* 
                TIMELINE
             */}

            <div
                className="
                    relative
                    space-y-4
                "
            >

                <div
                    className="
                        absolute
                        bottom-5
                        left-[20px]
                        top-5
                        w-px
                        bg-white/10
                    "
                />


                {preparationPlan.map(
                    (day) => (

                        <div
                            key={day.day}
                            className="
                                relative
                                flex
                                gap-4
                            "
                        >


                            {/* 
                                DAY NUMBER
                             */}

                            <div
                                className="
                                    relative
                                    z-10
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-violet-400/30
                                    bg-[#120F17]
                                    text-xs
                                    font-bold
                                    text-violet-400
                                "
                            >
                                {day.day}
                            </div>


                            {/* 
                                DAY CONTENT
                             */}

                            <div
                                className="
                                    min-w-0
                                    flex-1
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-[#181520]
                                    p-5
                                "
                            >

                                <div className="mb-4">

                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-widest
                                            text-violet-400
                                        "
                                    >
                                        Day {day.day}
                                    </p>


                                    <h2
                                        className="
                                            mt-1
                                            text-base
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        {day.focus}
                                    </h2>

                                </div>


                                <div
                                    className="
                                        space-y-3
                                    "
                                >

                                    {day.tasks.map(
                                        (
                                            task,
                                            index
                                        ) => (

                                            <div
                                                key={index}
                                                className="
                                                    flex
                                                    gap-3
                                                "
                                            >

                                                <ListChecks
                                                    className="
                                                        mt-0.5
                                                        h-4
                                                        w-4
                                                        shrink-0
                                                        text-cyan-400
                                                    "
                                                />


                                                <p
                                                    className="
                                                        text-sm
                                                        leading-6
                                                        text-gray-400
                                                    "
                                                >
                                                    {task}
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </div>

                    )
                )}

            </div>

        </div>

    );
}


// MATCH SCORE

function MatchScore({
    score,
}: {
    score: number;
}) {

    const radius = 45;

    const circumference =
        2 * Math.PI * radius;

    const progress =
        circumference -
        (score / 100) *
            circumference;


    return (

        <div>

            <p
                className="
                    mb-5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-gray-500
                "
            >
                Match Score
            </p>


            <div
                className="
                    flex
                    justify-center
                "
            >

                <div
                    className="
                        relative
                        h-32
                        w-32
                    "
                >

                    <svg
                        className="
                            h-full
                            w-full
                            -rotate-90
                        "
                        viewBox="0 0 110 110"
                    >

                        {/* Background circle */}

                        <circle
                            cx="55"
                            cy="55"
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="5"
                            className="text-white/5"
                        />


                        {/* Progress */}

                        <circle
                            cx="55"
                            cy="55"
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray={
                                circumference
                            }
                            strokeDashoffset={
                                progress
                            }
                            className="
                                text-emerald-400
                            "
                        />

                    </svg>


                    <div
                        className="
                            absolute
                            inset-0
                            flex
                            flex-col
                            items-center
                            justify-center
                        "
                    >

                        <span
                            className="
                                text-3xl
                                font-bold
                            "
                        >
                            {score}
                        </span>


                        <span
                            className="
                                text-[10px]
                                text-gray-500
                            "
                        >
                            %
                        </span>

                    </div>

                </div>

            </div>


            <p
                className="
                    mt-3
                    text-center
                    text-xs
                    text-emerald-400
                "
            >
                Strong match for this role
            </p>

        </div>

    );
}


// SKILL GAPS

function SkillGaps({
    skillGaps,
}: {
    skillGaps: SkillGap[];
}) {

    const severityStyles = {

        high:
            "border-red-400/20 bg-red-400/10 text-red-300",

        medium:
            "border-amber-400/20 bg-amber-400/10 text-amber-300",

        low:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",

    };


    return (

        <div>

            {/* 
                TITLE
             */}

            <div
                className="
                    mb-4
                    flex
                    items-center
                    gap-2
                "
            >

                <Trophy
                    className="
                        h-4
                        w-4
                        text-violet-400
                    "
                />


                <p
                    className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-gray-500
                    "
                >
                    Skill Gaps
                </p>

            </div>


            {/* 
                GAPS
             */}

            <div className="space-y-2">

                {skillGaps.map(
                    (gap, index) => (

                        <div
                            key={index}
                            className={`
                                rounded-lg
                                border
                                px-3
                                py-2
                                text-xs
                                leading-5
                                ${severityStyles[
                                    gap.severity
                                ]}
                            `}
                        >

                            <div
                                className="
                                    mb-1
                                    text-[9px]
                                    uppercase
                                    tracking-wider
                                    opacity-60
                                "
                            >
                                {gap.severity} gap
                            </div>


                            {gap.skill}

                        </div>

                    )
                )}

            </div>

        </div>

    );
}