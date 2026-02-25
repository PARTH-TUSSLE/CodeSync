"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import { Pin } from "lucide-react";

function page() {
  interface Repository {
    id: string;
    name: string;
    description?: string;
    content: string[];
    visibility: boolean;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface UserProfile {
    id: string;
    username: string;
    email: string;
    starredRepos: string[];
    pinnedRepos: string[];
  }

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestedRepositories, setSuggestedRepositories] = useState<
    Repository[]
  >([]);
  const [searchResults, setSearchResults] = useState<Repository[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Suggested repos search and pagination
  const [suggestedSearchQuery, setSuggestedSearchQuery] = useState<string>("");
  const [filteredSuggestedRepos, setFilteredSuggestedRepos] = useState<
    Repository[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Create repository modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newRepoName, setNewRepoName] = useState<string>("");
  const [newRepoDescription, setNewRepoDescription] = useState<string>("");
  const [newRepoVisibility, setNewRepoVisibility] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string>("");

  // Pinned repos — stored in DB via API
  const handlePinRepo = async (repoId: string) => {
    const token = localStorage.getItem("token");
    const isPinned = userProfile?.pinnedRepos?.includes(repoId);
    const endpoint = isPinned
      ? `http://localhost:8000/unpin/${repoId}`
      : `http://localhost:8000/pin/${repoId}`;

    try {
      await axios.put(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
      // Optimistically update local state
      setUserProfile((prev) =>
        prev
          ? {
            ...prev,
            pinnedRepos: isPinned
              ? prev.pinnedRepos.filter((id) => id !== repoId)
              : [...prev.pinnedRepos, repoId],
          }
          : prev
      );
    } catch (err) {
      console.error("Error toggling pin:", err);
    }
  };

  const handleStarRepo = async (repoId: string) => {
    const token = localStorage.getItem("token");

    try {
      const isStarred = userProfile?.starredRepos?.includes(repoId);

      if (isStarred) {
        // Unstar the repo
        console.log(token);
        await axios.put(
          `http://localhost:8000/unstar/${repoId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        // Update local state
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            starredRepos: userProfile.starredRepos.filter(
              (id) => id !== repoId,
            ),
          });
        }
      } else {
        // Star the repo
        await axios.put(
          `http://localhost:8000/star/${repoId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        // Update local state
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            starredRepos: [...userProfile.starredRepos, repoId],
          });
        }
      }
    } catch (error) {
      console.error("Error starring/unstarring repo:", error);
    }
  };

  const handleCreateRepository = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    if (!newRepoName.trim()) {
      setCreateError("Repository name is required");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setIsCreating(true);

      const response = await axios.post<{ createdRepo: Repository }>(
        "http://localhost:8000/repo/create",
        {
          name: newRepoName.trim(),
          description: newRepoDescription.trim() || undefined,
          content: [], // Start with empty content array
          visibility: newRepoVisibility,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Add the new repo to the list
      setRepositories([response.data.createdRepo, ...repositories]);

      // Reset form and close modal
      setNewRepoName("");
      setNewRepoDescription("");
      setNewRepoVisibility(true);
      setIsCreateModalOpen(false);
      setCreateError("");
    } catch (error: any) {
      const errMsg =
        error.response?.data?.msg ||
        error.message ||
        "Failed to create repository";
      setCreateError(errMsg);
      console.error("Error creating repository:", error);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    console.log("userId", userId);
    console.log("token", token);

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get<{ user: UserProfile }>(
          `http://localhost:8000/userProfile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUserProfile(response.data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchUserRepos = async () => {
      const response = await axios.get<{ userRepos: Repository[] }>(
        `http://localhost:8000/repo/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const userRepos = await response.data.userRepos;
      console.log(userRepos);
      setRepositories(userRepos);
    };

    fetchUserProfile();
    fetchUserRepos();
  }, []);

  useEffect(() => {
    const fetchAllRepos = async () => {
      const response = await axios.get<{ repos: Repository[] }>(`http://localhost:8000/allRepos`);
      const allRepos = await response.data.repos;
      console.log(allRepos);
      setSuggestedRepositories(allRepos);
    };
    fetchAllRepos();
  }, []);

  useEffect(() => { }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
      return;
    }
    const filteredRepos = repositories.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSearchResults(filteredRepos);
  }, [searchQuery, repositories]);

  // Filter suggested repositories based on search
  useEffect(() => {
    if (suggestedSearchQuery === "") {
      setFilteredSuggestedRepos(suggestedRepositories);
      setCurrentPage(1);
      return;
    }
    const filtered = suggestedRepositories.filter((repo) =>
      repo.name.toLowerCase().includes(suggestedSearchQuery.toLowerCase()),
    );
    setFilteredSuggestedRepos(filtered);
    setCurrentPage(1);
  }, [suggestedSearchQuery, suggestedRepositories]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSuggestedRepos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSuggestedRepos = filteredSuggestedRepos.slice(
    startIndex,
    endIndex,
  );

  const userName =
    typeof window !== "undefined"
      ? localStorage.getItem("userName") || "User"
      : "User";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      {/* Main Content - 3 Panel Layout */}
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
          {/* Left Panel - Suggested Repositories */}
          <div className="lg:col-span-3 order-3 lg:order-1">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 sm:p-4 lg:p-6">
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                Suggested Repositories
              </h2>

              {/* Search Bar for Suggested Repos */}
              <div className="mb-3 sm:mb-4">
                <input
                  type="text"
                  placeholder="Search suggestions..."
                  value={suggestedSearchQuery}
                  onChange={(e) => setSuggestedSearchQuery(e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-200 text-xs sm:text-sm transition-all"
                />
              </div>

              <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto hide-scrollbar">
                {paginatedSuggestedRepos.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    {suggestedSearchQuery
                      ? "No repositories match your search"
                      : "No repositories found"}
                  </p>
                ) : (
                  paginatedSuggestedRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className="p-2 sm:p-3 bg-gray-800 border border-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-750 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 cursor-pointer">
                          <h3 className="text-blue-400 font-semibold text-xs sm:text-sm hover:underline">
                            {repo.name}
                          </h3>
                          <p className="text-gray-400 text-[10px] sm:text-xs mt-1 line-clamp-2">
                            {repo.description || "No description provided"}
                          </p>
                          <div className="flex items-center gap-2 sm:gap-4 mt-2">
                            <span className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                              <span
                                className={`w-2 h-2 rounded-full ${repo.visibility ? "bg-green-500" : "bg-gray-500"}`}
                              ></span>
                              {repo.visibility ? "Public" : "Private"}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-500">
                              {repo.content.length} files
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarRepo(repo.id);
                          }}
                          className={`flex-shrink-0 p-1.5 rounded-lg border transition-all min-w-[36px] min-h-[36px] flex items-center justify-center ${userProfile?.starredRepos.includes(repo.id)
                            ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
                            : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750 hover:border-gray-600 hover:text-yellow-500"
                            }`}
                          title={
                            userProfile?.starredRepos.includes(repo.id)
                              ? "Unstar"
                              : "Star"
                          }
                        >
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            fill={
                              userProfile?.starredRepos.includes(repo.id)
                                ? "currentColor"
                                : "none"
                            }
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${currentPage === 1
                      ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-blue-500"
                      }`}
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1 sm:gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium transition-all ${currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-blue-500"
                            }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${currentPage === totalPages
                      ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-blue-500"
                      }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Middle Panel - Your Repositories */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 sm:p-4 lg:p-6">
              {/* Search Bar */}
              <div className="mb-3 sm:mb-4 lg:mb-6">
                <input
                  type="text"
                  placeholder="Search your repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-200 text-sm sm:text-base transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 lg:mb-6 gap-2 sm:gap-3">
                <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  Your Repositories
                </h2>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  + New Repository
                </button>
              </div>

              <div className="space-y-2 sm:space-y-3 lg:space-y-4 max-h-[300px] sm:max-h-[400px] lg:max-h-[600px] overflow-y-auto hide-scrollbar">
                {(searchQuery ? searchResults : repositories).length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-700 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500">
                      {searchQuery
                        ? "No repositories match your search"
                        : "You don't have any repositories yet"}
                    </p>
                  </div>
                ) : (
                  (searchQuery ? searchResults : repositories).map((repo) => (
                    <div
                      key={repo.id}
                      className="p-3 sm:p-4 lg:p-5 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-750 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                        <div className="flex-1">
                          <h3 className="text-blue-400 font-semibold text-sm sm:text-base lg:text-lg hover:underline">
                            {repo.name}
                          </h3>
                          <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-1.5 lg:mt-2">
                            {repo.description || "No description provided"}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-6 mt-2 sm:mt-3 lg:mt-4">
                            <span className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                              <span
                                className={`w-2 h-2 rounded-full ${repo.visibility ? "bg-green-500" : "bg-gray-500"}`}
                              ></span>
                              {repo.visibility ? "Public" : "Private"}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                              <svg
                                className="w-3 h-3 sm:w-4 sm:h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              {repo.content.length} files
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-500">
                              Updated{" "}
                              {new Date(repo.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {/* Pin button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePinRepo(repo.id);
                            }}
                            title={userProfile?.pinnedRepos?.includes(repo.id) ? "Unpin from profile" : "Pin to profile"}
                            className={`flex-shrink-0 p-2 rounded-lg border transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center ${userProfile?.pinnedRepos?.includes(repo.id)
                              ? "bg-purple-500/10 border-purple-500/40 text-purple-400 hover:bg-purple-500/20"
                              : "bg-gray-800 border-gray-700 text-gray-400 hover:border-purple-500/40 hover:text-purple-400"
                              }`}
                          >
                            <Pin
                              className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                              fill={userProfile?.pinnedRepos?.includes(repo.id) ? "currentColor" : "none"}
                            />
                          </button>
                          {/* Star button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStarRepo(repo.id);
                            }}
                            className={`flex-shrink-0 p-2 rounded-lg border transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${userProfile?.starredRepos.includes(repo.id)
                              ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
                              : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750 hover:border-gray-600 hover:text-yellow-500"
                              }`}
                            title={
                              userProfile?.starredRepos.includes(repo.id)
                                ? "Unstar"
                                : "Star"
                            }
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill={
                                userProfile?.starredRepos.includes(repo.id)
                                  ? "currentColor"
                                  : "none"
                              }
                              stroke="currentColor"
                              strokeWidth="1.5"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
                            </svg>
                          </button>
                          <button className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-all hover:shadow-lg">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Quick Actions & Stats */}
          <div className="lg:col-span-3 order-2 lg:order-3 space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Stats Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 sm:p-4 lg:p-6">
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Your Stats
              </h2>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 sm:gap-3 lg:gap-4">
                <div className="p-2 sm:p-3 lg:p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {repositories.length}
                  </div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-gray-400 mt-1">
                    Total Repositories
                  </div>
                </div>
                <div className="p-2 sm:p-3 lg:p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-green-500 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400">
                    {repositories.filter((r) => r.visibility).length}
                  </div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-gray-400 mt-1">
                    Public Repos
                  </div>
                </div>
                <div className="p-2 sm:p-3 lg:p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-orange-500 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/10">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-400">
                    {repositories.filter((r) => !r.visibility).length}
                  </div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-gray-400 mt-1">
                    Private Repos
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 sm:p-4 lg:p-6">
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-green-500 rounded-lg text-left text-xs sm:text-sm text-gray-300 transition-all duration-200 flex items-center gap-2 sm:gap-3 hover:shadow-lg hover:shadow-green-500/10"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="truncate">Create New Repository</span>
                </button>
                <button
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-lg text-left text-xs sm:text-sm text-gray-300 transition-all duration-200 flex items-center gap-2 sm:gap-3 hover:shadow-lg hover:shadow-blue-500/10"
                  onClick={() => redirect("/user/profile")}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="truncate">View Profile</span>
                </button>
                <button className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500 rounded-lg text-left text-xs sm:text-sm text-gray-300 transition-all duration-200 flex items-center gap-2 sm:gap-3 hover:shadow-lg hover:shadow-purple-500/10">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="truncate">Settings</span>
                </button>
                <button className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-yellow-500 rounded-lg text-left text-xs sm:text-sm text-gray-300 transition-all duration-200 flex items-center gap-2 sm:gap-3 hover:shadow-lg hover:shadow-yellow-500/10">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="truncate">Documentation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Repository Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-2xl">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">
                  Create New Repository
                </h2>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setCreateError("");
                    setNewRepoName("");
                    setNewRepoDescription("");
                    setNewRepoVisibility(true);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateRepository} className="space-y-4">
                {createError && (
                  <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {createError}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="repoName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Repository Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="repoName"
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    placeholder="my-awesome-project"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-200 text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="repoDescription"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Description{" "}
                    <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <textarea
                    id="repoDescription"
                    value={newRepoDescription}
                    onChange={(e) => setNewRepoDescription(e.target.value)}
                    placeholder="A brief description of your repository..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-200 text-sm transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Visibility
                  </label>
                  <div className="space-y-2 sm:space-y-3">
                    <label
                      onClick={() => setNewRepoVisibility(true)}
                      className={`flex items-start p-2.5 sm:p-3 lg:p-4 bg-gray-800 border rounded-lg cursor-pointer transition-all ${newRepoVisibility === true
                        ? "border-blue-500 ring-1 ring-blue-500/40"
                        : "border-gray-700 hover:border-blue-500"
                        }`}
                    >
                      <span className="mt-0.5 mr-2 sm:mr-3 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                        style={{
                          borderColor: newRepoVisibility === true ? "#3b82f6" : "#6b7280",
                          backgroundColor: "transparent",
                        }}
                      >
                        {newRepoVisibility === true && (
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Public
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Anyone can see this repository
                        </p>
                      </div>
                    </label>
                    <label
                      onClick={() => setNewRepoVisibility(false)}
                      className={`flex items-start p-2.5 sm:p-3 lg:p-4 bg-gray-800 border rounded-lg cursor-pointer transition-all ${newRepoVisibility === false
                        ? "border-blue-500 ring-1 ring-blue-500/40"
                        : "border-gray-700 hover:border-blue-500"
                        }`}
                    >
                      <span className="mt-0.5 mr-2 sm:mr-3 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                        style={{
                          borderColor: newRepoVisibility === false ? "#3b82f6" : "#6b7280",
                          backgroundColor: "transparent",
                        }}
                      >
                        {newRepoVisibility === false && (
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          Private
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Only you can see this repository
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setCreateError("");
                      setNewRepoName("");
                      setNewRepoDescription("");
                      setNewRepoVisibility(true);
                    }}
                    className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg transition-all"
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !newRepoName.trim()}
                    className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-sm bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
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
                        Creating...
                      </>
                    ) : (
                      "Create Repository"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
