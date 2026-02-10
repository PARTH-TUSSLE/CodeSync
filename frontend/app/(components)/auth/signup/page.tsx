"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/authContext";

function SignupPage() {
  const router = useRouter();
  const { setCurrUser } = useAuth() as {
    setCurrUser: (userId: string) => void;
  };
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      username: usernameRef.current?.value || "",
      email: emailRef.current?.value || "",
      password: passwordRef.current?.value || "",
    };

    try {
      setIsLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:8000/signup",
        formData,
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);

      
      setCurrUser(response.data.user.id);

      usernameRef.current!.value = "";
      emailRef.current!.value = "";
      passwordRef.current!.value = "";

      router.push("/dashboard");
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Signup failed. Please try again.";
      setError(errMsg);
      console.log(`Some error occurred while signing up - ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="flex justify-center mb-8">
          <Image
            src="/codeSyncLogo.svg"
            alt="CodeSync"
            width={60}
            height={60}
            className="brightness-0 invert"
          />
        </div>


        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 shadow-2xl">
          <h1 className="text-2xl font-light text-[#f0f6fc] mb-2 text-center">
            Sign up to CodeSync
          </h1>
          <p className="text-[#8b949e] text-sm text-center mb-6">
            Create your account to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#c9d1d9] mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                ref={usernameRef}
                required
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent transition-all"
                placeholder="Enter your username"
              />
            </div>


            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#c9d1d9] mb-2"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                ref={emailRef}
                required
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>


            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#c9d1d9] mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                ref={passwordRef}
                required
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent transition-all"
                placeholder="Create a password"
              />
              <p className="text-xs text-[#8b949e] mt-1">
                Make sure it's at least 8 characters
              </p>
            </div>


            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#1a5928] disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200 mt-6 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        
        <div className="mt-6 text-center">
          <p className="text-[#8b949e] text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#58a6ff] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
