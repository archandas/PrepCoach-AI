import {createContext, useState} from 'react';
import type {ReactNode,Dispatch,SetStateAction} from 'react'

interface AuthContextType {
  report: any;
  setReport: Dispatch<SetStateAction<any>>;
   reports: any;
  setReports: Dispatch<SetStateAction<any>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}


export const InterviewContext = createContext<AuthContextType | null>(null)

export const InterviewProvider = ({children}: {children: React.ReactNode}) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    return(
        <InterviewContext value={{loading, setLoading, report, setReport, reports, setReports}}>
            {children}
        </InterviewContext>
    )
}