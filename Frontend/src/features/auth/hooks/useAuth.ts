import {useEffect,useContext} from "react";
import {AuthContext} from "../auth.context"
import {register,login,logout,getMe} from "../services/auth.api"

interface RegistrationFormData{
    username: string,
    email: string,
    password: string
}

interface LoginFormData{
    email: string,
    password: string
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("AuthContext not found");
    }

    const {user,setUser,loading,setLoading} = context

    // Function to handle user login
    const handleLogin = async ({email,password}:LoginFormData) => {
        setLoading(true);
        try{
        const data = await login({email,password})
        setUser(data.user)
        } catch(err){
            throw err
        } finally{
            setLoading(false)
        }
        
    }

    // Function to handle user registration
    const handleRegister = async ({username,email,password}:RegistrationFormData) => {
        setLoading(true)
        try{
        const data = await register({username,email,password})
        setUser(data.user)
        } catch(err){
            throw err
        } finally{
            setLoading(false)
        }
    }

    // Function to handle user logout
    const handleLogout = async () => {
        setLoading(true)
        try{
        const data = await logout()
        setUser(null)
        } catch(err){
            throw err
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
    const getAndSetUser = async () => {
        try {
            const data = await getMe();
            setUser(data.user);
        } catch (err) {
            console.error("user is not logged in");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    getAndSetUser();
}, []);

    return {user,loading,handleLogin,handleRegister,handleLogout}
}