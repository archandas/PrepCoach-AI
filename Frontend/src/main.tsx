import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import {AuthProvider} from "./features/auth/auth.context.tsx"
import { InterviewProvider } from './features/interview/interview.context.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
     <AuthProvider>
      <InterviewProvider>
        <App />
      </InterviewProvider>
     </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
