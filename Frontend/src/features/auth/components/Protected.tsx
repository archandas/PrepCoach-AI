import {useAuth} from "../hooks/useAuth"
import { Navigate } from "react-router-dom"
import type {ReactNode} from "react"
import Loader from "../pages/Loader"

interface childrenProp{
    children: ReactNode
}

const Protected = ({children}: childrenProp) => {
    const {loading,user} = useAuth()

    if(loading){
        return(
            <Loader/>
        )
    }

    if(!user){
        return <Navigate to={'/login'}/>
    }

    return children
}

export default Protected