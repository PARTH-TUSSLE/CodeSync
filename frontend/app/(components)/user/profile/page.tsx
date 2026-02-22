"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

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
    following: string[];
    followers: string[];
    starredRepos: string[];
    bio?: string;
    profilePic?: string;
    location?: string;
    company?: string;
    website?: string;
  }

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("repositories");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("Last updated");

  const handleStarRepo = async (repoId: string) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      const isStarred = userProfile?.starredRepos.includes(repoId);

      if (isStarred) {
        // Unstar the repo
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

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await axios.get(
          `http://localhost:8000/userProfile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const user = profileResponse.data.user;
        console.log(user);
        setUserProfile(user);

        // Fetch user repositories
        const repoResponse = await axios.get(
          `http://localhost:8000/repo/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const userRepos = repoResponse.data.userRepos;
        console.log(userRepos);
        setRepositories(userRepos);
        setFilteredRepos(userRepos);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    let filtered = repositories;

    // Filter by search query
    if (searchQuery !== "") {
      filtered = filtered.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by type (Public/Private/All)
    if (filterType === "Public") {
      filtered = filtered.filter((repo) => repo.visibility === true);
    } else if (filterType === "Private") {
      filtered = filtered.filter((repo) => repo.visibility === false);
    }

    // Sort repositories
    if (sortBy === "Name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Last updated") {
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    }

    setFilteredRepos(filtered);
  }, [searchQuery, repositories, filterType, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-6">
              {/* Profile Picture */}
              <div className="mb-3 sm:mb-4 flex justify-center lg:justify-start">
                <img
                  src={
                    userProfile.profilePic ||
                    `https://ui-avatars.com/api/?name=${userProfile.username}&background=6366f1&color=fff&size=256&bold=true`
                  }
                  alt={userProfile.username}
                  className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full border-2 border-gray-700 object-cover bg-gray-800"
                />
              </div>

              {/* Name and Username */}
              <div className="mb-2 sm:mb-3 text-center lg:text-left">
                <h1 className="text-lg sm:text-xl lg:text-xl font-semibold text-white mb-0.5 break-words">
                  {userProfile.username}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-400 font-light break-words">
                  {userProfile.username.toLowerCase()}
                </p>
              </div>

              {/* Bio */}
              {userProfile.bio && (
                <div className="mb-2 sm:mb-3 text-center lg:text-left">
                  <p className="text-xs sm:text-sm text-gray-300 break-words">
                    {userProfile.bio}
                  </p>
                </div>
              )}

              {/* Edit Profile Button */}
              <button className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-white transition-colors mb-2 sm:mb-3">
                Edit profile
              </button>

              {/* Followers */}
              <div className="flex items-center justify-center lg:justify-start flex-wrap gap-1 text-xs sm:text-sm mb-2 sm:mb-3">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a3.001 3.001 0 01.5 5.974 5.5 5.5 0 013.145 4.659.75.75 0 01-1.49.173 4.001 4.001 0 00-7.31 0 .75.75 0 01-1.49-.173A5.5 5.5 0 018.5 9.974 3.001 3.001 0 0111 4z"></path>
                </svg>
                <span className="text-gray-400">
                  <span className="text-white font-semibold">
                    {userProfile.followers.length}
                  </span>{" "}
                  followers
                </span>
                <span className="text-gray-600">·</span>
                <span className="text-gray-400">
                  <span className="text-white font-semibold">
                    {userProfile.following.length}
                  </span>{" "}
                  following
                </span>
              </div>

              {/* Additional Info */}
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                {userProfile.company && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1.75 1A1.75 1.75 0 000 2.75v11.5C0 15.216.784 16 1.75 16h12.5A1.75 1.75 0 0016 14.25V2.75A1.75 1.75 0 0014.25 1H1.75zM1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v11.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V2.75zM4 5a.75.75 0 000 1.5h8a.75.75 0 000-1.5H4zm0 3a.75.75 0 000 1.5h5a.75.75 0 000-1.5H4z"></path>
                    </svg>
                    <span className="break-words">{userProfile.company}</span>
                  </div>
                )}

                {userProfile.location && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"></path>
                    </svg>
                    <span className="break-words">{userProfile.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-400">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14H1.75A1.75 1.75 0 010 12.25v-8.5C0 2.784.784 2 1.75 2zM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809v6.442zm13-8.181v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81z"></path>
                  </svg>
                  <a
                    href={`mailto:${userProfile.email}`}
                    className="hover:text-blue-400 hover:underline break-all"
                  >
                    {userProfile.email}
                  </a>
                </div>

                {userProfile.website && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path>
                    </svg>
                    <a
                      href={userProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 hover:underline truncate"
                    >
                      {userProfile.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
            {/* Tabs */}
            <div className="border-b border-gray-800 mb-3 sm:mb-4">
              <nav className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto hide-scrollbar">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-2 sm:py-3 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === "overview"
                      ? "border-orange-500 text-white"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1H4z"
                      ></path>
                      <path d="M6 5.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zM6 7.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zM6 9.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5z"></path>
                    </svg>
                    Overview
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("repositories")}
                  className={`py-2 sm:py-3 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === "repositories"
                      ? "border-orange-500 text-white"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
                    </svg>
                    Repositories
                    {repositories.length > 0 && (
                      <span className="hidden sm:inline px-1.5 py-0.5 bg-gray-800 text-xs rounded-full">
                        {repositories.length}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("stars")}
                  className={`py-2 sm:py-3 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === "stars"
                      ? "border-orange-500 text-white"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
                    </svg>
                    Stars
                    {userProfile.starredRepos.length > 0 && (
                      <span className="hidden sm:inline px-1.5 py-0.5 bg-gray-800 text-[10px] sm:text-xs rounded-full">
                        {userProfile.starredRepos.length}
                      </span>
                    )}
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === "overview" && (
                <div className="space-y-3 sm:space-y-4">
                  {/* Pinned Repositories Section */}
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-xs sm:text-sm font-normal text-gray-300 mb-2 sm:mb-3">
                      Pinned
                    </h2>
                    <div className="text-center py-8 sm:py-12 bg-gray-900 border border-gray-800 rounded-lg">
                      <svg
                        className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-700 mb-2 sm:mb-3"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4.456.734a1.75 1.75 0 012.826.504l.613 1.327a3.081 3.081 0 002.084 1.707l2.454.584c1.332.317 1.8 1.972.832 2.94L11.06 10l.78 2.341a1.75 1.75 0 01-2.491 2.049L8 13.81l-1.349.58a1.75 1.75 0 01-2.491-2.049L5.94 10 3.736 7.796c-.968-.968-.5-2.623.832-2.94l2.454-.584a3.08 3.08 0 002.084-1.707l.613-1.327a1.75 1.75 0 01.737-.504z"></path>
                      </svg>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        No pinned repositories yet
                      </p>
                    </div>
                  </div>

                  {/* Contribution Activity Placeholder */}
                  <div>
                    <h2 className="text-xs sm:text-sm font-normal text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                      <span>Contribution activity</span>
                    </h2>
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 text-center">
                      <p className="text-gray-500 text-xs sm:text-sm">
                        Contribution heatmap coming soon...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "repositories" && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
                    <input
                      type="text"
                      placeholder="Find a repository..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs sm:text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-2 sm:px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs sm:text-sm text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:bg-gray-750 transition-colors cursor-pointer"
                      >
                        <option>All</option>
                        <option>Public</option>
                        <option>Private</option>
                      </select>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-2 sm:px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs sm:text-sm text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:bg-gray-750 transition-colors cursor-pointer"
                      >
                        <option>Last updated</option>
                        <option>Name</option>
                      </select>
                    </div>
                  </div>

                  {filteredRepos.length === 0 ? (
                    <div className="text-center py-12 sm:py-16">
                      <svg
                        className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-700 mb-3 sm:mb-4"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"></path>
                      </svg>
                      <p className="text-gray-500 mb-2 text-sm sm:text-base">
                        {searchQuery
                          ? "No repositories match your search"
                          : "No repositories yet"}
                      </p>
                      {!searchQuery && (
                        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors">
                          Create a new repository
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {filteredRepos.map((repo) => (
                        <div
                          key={repo.id}
                          className="p-3 sm:p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2 sm:gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-blue-400 font-semibold text-sm sm:text-base hover:underline mb-1 truncate cursor-pointer">
                                {repo.name}
                              </h3>
                              <p className="text-gray-400 text-xs sm:text-sm mb-2 line-clamp-2">
                                {repo.description || "No description provided"}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      repo.visibility
                                        ? "bg-green-500"
                                        : "bg-gray-500"
                                    }`}
                                  ></span>
                                  {repo.visibility ? "Public" : "Private"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  {repo.content.length} files
                                </span>
                                <span>
                                  Updated{" "}
                                  {new Date(
                                    repo.updatedAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStarRepo(repo.id);
                              }}
                              className={`flex-shrink-0 p-2 rounded-lg border transition-all min-w-[40px] min-h-[40px] flex items-center justify-center ${
                                userProfile?.starredRepos.includes(repo.id)
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
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "stars" && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
                    <input
                      type="text"
                      placeholder="Find a starred repository..."
                      className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs sm:text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <select className="px-2 sm:px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs sm:text-sm text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:bg-gray-750 transition-colors cursor-pointer">
                      <option>Sort: Recently starred</option>
                      <option>Recently starred</option>
                      <option>Recently active</option>
                      <option>Most stars</option>
                    </select>
                  </div>

                  {userProfile.starredRepos.length === 0 ? (
                    <div className="text-center py-12 sm:py-16">
                      <svg
                        className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-700 mb-3 sm:mb-4"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
                      </svg>
                      <p className="text-gray-500 mb-2 text-sm sm:text-base">
                        No starred repositories yet
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Star repositories to keep track of projects you find
                        interesting
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {repositories
                        .filter((repo) =>
                          userProfile.starredRepos.includes(repo.id),
                        )
                        .map((repo) => (
                          <div
                            key={repo.id}
                            className="p-3 sm:p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2 sm:gap-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-blue-400 font-semibold text-sm sm:text-base hover:underline mb-1 truncate cursor-pointer">
                                  {repo.name}
                                </h3>
                                <p className="text-gray-400 text-xs sm:text-sm mb-2 line-clamp-2">
                                  {repo.description ||
                                    "No description provided"}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <span
                                      className={`w-2 h-2 rounded-full ${
                                        repo.visibility
                                          ? "bg-green-500"
                                          : "bg-gray-500"
                                      }`}
                                    ></span>
                                    {repo.visibility ? "Public" : "Private"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <svg
                                      className="w-3 h-3"
                                      fill="currentColor"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {repo.content.length} files
                                  </span>
                                  <span>
                                    Updated{" "}
                                    {new Date(
                                      repo.updatedAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStarRepo(repo.id);
                                }}
                                className={`flex-shrink-0 p-2 rounded-lg border transition-all min-w-[40px] min-h-[40px] flex items-center justify-center ${
                                  userProfile?.starredRepos.includes(repo.id)
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
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
