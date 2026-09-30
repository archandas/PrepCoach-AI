import FaultyTerminal from '../components/FaultyTerminal';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import Loader from "./Loader";
import { Brain } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const { user, loading, handleLogin } = useAuth();

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    await handleLogin({ email, password });

    toast.success("Welcome Back!");

    setEmail("");
    setPassword("");

    navigate("/");
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Invalid email or password"
    );
    navigate("/login")
  }
};

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="text-white min-h-screen lg:h-screen w-full flex items-center justify-center relative overflow-y-auto lg:overflow-hidden py-5 lg:py-0">

      <div className="inset-0 absolute z-0">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.5}
          pause={false}
          scanlineIntensity={0.5}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint="#0bb8f8"
          mouseReact
          mouseStrength={0.5}
          pageLoadAnimation
          brightness={0.6}
        />
      </div>

      <div className="relative h-auto lg:h-[95%] w-[94%] sm:w-[90%] lg:w-[98%] rounded-xl flex items-center justify-center">

        <div className="absolute h-full w-full inset-0 bg-white/10 backdrop-blur-[3px] rounded-xl"></div>

        <div className="h-auto lg:h-full w-full rounded-xl relative lg:absolute z-10 flex flex-col lg:flex-row items-stretch justify-between">

          {/* LEFT SECTION */}

          <div className="min-h-[420px] lg:h-full h-auto w-full lg:w-[48%] flex items-center justify-center">

            <div className="flex flex-col justify-center gap-12 lg:gap-30 h-[90%] lg:h-[95%] w-[85%] lg:w-[90%]">

              <div className="w-60 text-white flex items-center gap-2">

                <Brain className="h-8 w-8 text-cyan-400" />

                <p className="h-10 pt-2 text-lg font-bold">
                  PrepCoach AI
                </p>

              </div>

              <div className="h-auto lg:h-[50%] w-full mx-auto flex flex-col">

                <p className="text-2xl sm:text-3xl text-bold text-white">
                  Prepare Smarter. Get Hired Faster.
                </p>

                <p className="text-md text-semibold text-white/80 mt-3">
                  Everything you need to ace interviews, build a stronger resume, and confidently apply for your next opportunity.
                </p>

              </div>

            </div>

          </div>


          {/* RIGHT / LOGIN SECTION */}

          <div className="flex items-center justify-center bg-cyan-400/30 border border-black/20 h-auto lg:h-full w-full lg:w-[50%] rounded-b-xl lg:rounded-b-none lg:rounded-tr-xl lg:rounded-br-xl py-10 lg:py-0">
          
            <div className="flex flex-col items-center justify-center h-auto lg:h-[95%] w-[85%] lg:w-[90%]">
          
              <div className="flex flex-col items-center justify-center gap-1 h-auto lg:h-[20%] w-full lg:w-[95%] py-6 lg:py-0">
          
                <p className="text-2xl text-white font-bold">
                  Let's get started
                </p>
          
                <p className="text-md text-white/80 font-semibold text-center">
                  Please sign up or log in to continue
                </p>
          
              </div>
          
              <div className="h-auto lg:h-[75%] w-full lg:w-[95%] flex flex-col items-center justify-center">
          
                <form
                  onSubmit={handleSubmit}
                  className="h-auto lg:h-full w-full flex flex-col items-center justify-center gap-5"
                >
          
                  <label className="text-md font-semibold mr-auto">
                    Email
                  </label>
          
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    className="h-12 w-full px-4 py-2 bg-white text-black placeholder-gray-500 focus:outline-none border border-3 border-gray-900"
                  />
          
                  <label className="text-md font-semibold mr-auto">
                    Password
                  </label>
          
                  <input
                    required
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    className="h-12 w-full px-4 py-2 bg-white text-black placeholder-gray-500 focus:outline-none border border-3 border-gray-900"
                  />
          
                  <button
                    type="submit"
                    className="h-12 w-full max-w-[280px] sm:w-1/2 mx-auto bg-cyan-400 text-white font-semibold hover:bg-cyan-500 active:bg-cyan-600 hover:text-[#2e2e2e] transition duration-300 cursor-pointer drop-shadow-[10px_10px_0px_#2e2e2e]"
                  >
                    Login
                  </button>
          
                </form>
          
                <p className="mt-6 lg:mb-8 text-white/80 text-sm text-center">
                  Don't have an account?{" "}
                  <Link
                    to={"/register"}
                    className="hover:text-black no-underline cursor-pointer"
                  >
                    Signup
                  </Link>
                </p>
          
              </div>
          
            </div>
          
          </div>

        </div>

      </div>

    </div>
  );
}