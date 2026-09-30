import {Route, Routes} from 'react-router-dom'
import './App.css'
import Register from './features/auth/pages/Register'
import Login from './features/auth/pages/Login'
import Home from './features/interview/pages/Home'
import Interview from './features/interview/pages/Interview'
import Protected from './features/auth/components/Protected'
import NotFound from './features/auth/components/NotFound'
import {Toaster} from 'react-hot-toast'

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Protected><Home/></Protected>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/interview/:interviewId" element={<Protected><Interview/></Protected>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#15121C",
            color: "#fff",
            border: "1px solid #2a2533",
          },
        }}
      />
    </>
  )
}

export default App
