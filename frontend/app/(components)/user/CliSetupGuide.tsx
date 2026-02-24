"use client";
import React, { useState, useEffect } from "react";
import {
  Terminal,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  Sparkles,
  Code2,
  GitBranch,
} from "lucide-react";

export default function CliSetupGuide() {
  const [copied, setCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleCopy = () => {
    const command = `npm run dev login ${token}`;
    try {
      navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!token) {
    return null;
  }

  const maskedToken = "•".repeat(40);
  const displayToken = showToken ? token : maskedToken;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 px-6 sm:px-8 lg:px-12 py-8 sm:py-10 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Terminal className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                CLI Authentication Setup
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Connect your terminal to track contributions automatically
              </p>
            </div>
          </div>

          {/* Why This Matters */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Why authenticate your CLI?
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Your contribution graph only tracks web activity by default.
                  To show commits and pushes made from your terminal (the real
                  developer workflow), you need to authenticate your CLI once.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 sm:p-4 border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-300">
                    Track Commits
                  </h4>
                </div>
                <p className="text-xs text-blue-800 dark:text-blue-400">
                  Every commit you make appears on your profile
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 sm:p-4 border border-purple-100 dark:border-purple-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="text-xs sm:text-sm font-semibold text-purple-900 dark:text-purple-300">
                    Track Pushes
                  </h4>
                </div>
                <p className="text-xs text-purple-800 dark:text-purple-400">
                  Push events add to your contribution streak
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 sm:p-4 border border-green-100 dark:border-green-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <h4 className="text-xs sm:text-sm font-semibold text-green-900 dark:text-green-300">
                    One-time Setup
                  </h4>
                </div>
                <p className="text-xs text-green-800 dark:text-green-400">
                  Login once, works forever - just like Git
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Step 1 */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold shadow-md">
                1
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Copy your login command
              </h3>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-900 dark:bg-gray-950 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-700">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    ~/your-project
                  </span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowToken(!showToken)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-white transition-all duration-200"
                    title={showToken ? "Hide token" : "Show token"}
                  >
                    {showToken ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs sm:text-sm font-medium text-white transition-all duration-200 shadow-md"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm bg-gray-950 overflow-x-auto">
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-1.5">
                      <span className="text-purple-400">npm</span>
                      <span className="text-blue-400">run</span>
                      <span className="text-yellow-400">dev</span>
                      <span className="text-green-400">login</span>
                    </div>
                    <div className="mt-2 text-gray-300 break-all select-all leading-relaxed">
                      {displayToken}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold shadow-md">
                2
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Run in your terminal
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 italic">
              Navigate to your project root directory first, then run:
            </p>

            <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 sm:p-5 border border-gray-700 dark:border-gray-800 font-mono text-xs sm:text-sm text-gray-100 overflow-x-auto">
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 mt-0.5 shrink-0" />
                  <div className="flex flex-wrap items-center gap-x-1.5">
                    <span className="text-purple-400">npm</span>
                    <span className="text-blue-400">run</span>
                    <span className="text-yellow-400">dev</span>
                    <span className="text-green-400">login</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 mt-0.5 shrink-0" />
                  <span className="text-gray-400 break-all">
                    {displayToken}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold shadow-md">
                3
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Use CodeSync normally
              </h3>
            </div>

            <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 sm:p-5 border border-gray-700 dark:border-gray-800 font-mono text-xs sm:text-sm text-gray-100 overflow-x-auto">
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 mt-0.5 shrink-0" />
                  <div className="flex flex-wrap items-center gap-x-1.5">
                    <span className="text-purple-400">npm</span>
                    <span className="text-blue-400">run</span>
                    <span className="text-yellow-400">dev</span>
                    <span className="text-green-400">init</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 mt-0.5 shrink-0" />
                  <div className="flex flex-wrap items-center gap-x-1.5">
                    <span className="text-purple-400">npm</span>
                    <span className="text-blue-400">run</span>
                    <span className="text-yellow-400">dev</span>
                    <span className="text-green-400">add</span>
                    <span className="text-orange-400">file.ts</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 mt-0.5 shrink-0" />
                  <div className="flex flex-wrap items-center gap-x-1.5">
                    <span className="text-purple-400">npm</span>
                    <span className="text-blue-400">run</span>
                    <span className="text-yellow-400">dev</span>
                    <span className="text-green-400">commit</span>
                    <span className="text-orange-400">"message"</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 mt-0.5 shrink-0" />
                  <div className="flex flex-wrap items-center gap-x-1.5">
                    <span className="text-purple-400">npm</span>
                    <span className="text-blue-400">run</span>
                    <span className="text-yellow-400">dev</span>
                    <span className="text-green-400">push</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-6 sm:mt-8">
            {/* Security Warning */}
            <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-700/50 dark:border-amber-600/40 rounded-xl p-4 sm:p-5">
              <div className="flex gap-3 sm:gap-4">
                <div className="shrink-0 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 dark:text-amber-300" />
                </div>
                <div>
                  <h4          className="text-base sm:text-lg font-bold text-amber-300 dark:text-amber-200 mb-2">
                    Security Notice
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-200/90 dark:text-amber-100/80 leading-relaxed">
                    Keep your token private. Don't share screenshots with it
                    visible. Anyone with this token can access your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-700/50 dark:border-blue-600/40 rounded-xl p-4 sm:p-5">
              <div className="flex gap-3 sm:gap-4">
                <div className="shrink-0 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 dark:text-blue-300" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-blue-300 dark:text-blue-200 mb-2">
                    Pro Tip
                  </h4>
                  <p className="text-xs sm:text-sm text-blue-200/90 dark:text-blue-100/80 leading-relaxed">
                    Login once and the CLI remembers your credentials
                    automatically. Works exactly like Git configuration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
