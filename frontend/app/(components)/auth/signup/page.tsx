"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

function SignupPage() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle signup logic here
    const formData = {
      username: usernameRef.current?.value || "",
      email: emailRef.current?.value || "",
      password: passwordRef.current?.value || "",
    };
    console.log("Signup data:", formData);
    usernameRef.current!.value = "";
    emailRef.current!.value = "";
    passwordRef.current!.value = "";

  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/codeSyncLogo.svg"
            alt="CodeSync"
            width={60}
            height={60}
            className="brightness-0 invert"
          />
        </div>

        {/* Sign up form card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 shadow-2xl">
          <h1 className="text-2xl font-light text-[#f0f6fc] mb-2 text-center">
            Sign up to CodeSync
          </h1>
          <p className="text-[#8b949e] text-sm text-center mb-6">
            Create your account to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
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

            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200 mt-6 cursor-pointer"
            >
              Create account
            </button>
          </form>
        </div>

        {/* Login Link */}
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
