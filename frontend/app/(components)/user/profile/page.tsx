"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ContributionHeatmap from "../ContributionHeatmap";
import CliSetupGuide from "../CliSetupGuide";
import { Pin } from "lucide-react";

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
  pinnedRepos: string[];
  bio?: string[];
  profilePic?: string;
  location?: string;
  company?: string;
  website?: string;
}

function page() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("repositories");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("Last updated");

  // Create repository modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newRepoName, setNewRepoName] = useState<string>("");
  const [newRepoDescription, setNewRepoDescription] = useState<string>("");
  const [newRepoVisibility, setNewRepoVisibility] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string>("");

  // Edit profile modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editUsername, setEditUsername] = useState<string>("");
  const [editBio, setEditBio] = useState<string>("");
  const [editProfilePic, setEditProfilePic] = useState<string>("");
  const [uploadedProfilePicData, setUploadedProfilePicData] = useState<string>("");
  const [editError, setEditError] = useState<string>("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);

  // Change password modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

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
          content: [],
          visibility: newRepoVisibility,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRepositories([response.data.createdRepo, ...repositories]);
      setFilteredRepos([response.data.createdRepo, ...filteredRepos]);
      setNewRepoName("");
      setNewRepoDescription("");
      setNewRepoVisibility(true);
      setIsCreateModalOpen(false);
      setCreateError("");
    } catch (error: any) {
      setCreateError(error.response?.data?.msg || error.message || "Failed to create repository");
    } finally {
      setIsCreating(false);
    }
  };

  const handleStarRepo = async (repoId: string) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      const isStarred = userProfile?.starredRepos?.includes(repoId);

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

  const openEditProfileModal = () => {
    if (!userProfile) return;
    setEditUsername(userProfile.username || "");
    setEditBio(userProfile.bio?.[0] || "");
    setEditProfilePic(userProfile.profilePic || "");
    setUploadedProfilePicData("");
    setEditError("");
    setIsEditModalOpen(true);
  };

  const closeEditProfileModal = () => {
    setIsEditModalOpen(false);
    setEditUsername("");
    setEditBio("");
    setEditProfilePic("");
    setUploadedProfilePicData("");
    setEditError("");
    setIsUpdatingProfile(false);
  };

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });

  const handleProfilePicUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setEditError("Please upload a valid image file");
      e.target.value = "";
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setEditError("Image size should be 5MB or less");
      e.target.value = "";
      return;
    }

    try {
      setEditError("");
      const dataUrl = await fileToDataUrl(file);
      setUploadedProfilePicData(dataUrl);
    } catch (error: any) {
      setEditError(error.message || "Failed to process uploaded image");
    }
  };

  const openChangePasswordModal = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError("");
    setIsPasswordModalOpen(true);
  };

  const closeChangePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError("");
    setIsChangingPassword(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setEditError("Not authenticated");
      return;
    }

    const trimmedUsername = editUsername.trim();
    const trimmedBio = editBio.trim();
    const trimmedProfilePic = editProfilePic.trim();
    const finalProfilePic = uploadedProfilePicData || trimmedProfilePic;

    const payload: { username?: string; bio?: string; profilePic?: string } = {};

    if (!trimmedUsername) {
      setEditError("Username is required");
      return;
    }

    if (trimmedUsername !== userProfile.username) {
      payload.username = trimmedUsername;
    }

    if (trimmedBio !== (userProfile.bio?.[0] || "")) {
      payload.bio = trimmedBio;
    }

    if (finalProfilePic !== (userProfile.profilePic || "")) {
      payload.profilePic = finalProfilePic;
    }

    if (!payload.username && payload.bio === undefined && payload.profilePic === undefined) {
      setEditError("Please change username, bio, or profile picture before saving");
      return;
    }

    try {
      setIsUpdatingProfile(true);
      setEditError("");

      await axios.put(
        `http://localhost:8000/updateProfile/${userProfile.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUserProfile((prev) =>
        prev
          ? {
              ...prev,
              username: payload.username ?? prev.username,
              bio: payload.bio !== undefined ? [payload.bio] : prev.bio,
              profilePic:
                payload.profilePic !== undefined ? payload.profilePic || undefined : prev.profilePic,
            }
          : prev,
      );

      if (payload.username) {
        localStorage.setItem("userName", payload.username);
      }

      closeEditProfileModal();
    } catch (error: any) {
      if (error.response?.status === 413) {
        setEditError("Image is too large. Please use an image under 5MB.");
      } else {
        setEditError(error.response?.data?.msg || error.message || "Failed to update profile");
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setPasswordError("Not authenticated");
      return;
    }

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    try {
      setIsChangingPassword(true);
      setPasswordError("");

      await axios.put(
        `http://localhost:8000/changePassword/${userProfile.id}`,
        {
          oldPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      closeChangePasswordModal();
    } catch (error: any) {
      setPasswordError(error.response?.data?.msg || error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await axios.get<{ user: UserProfile }>(
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
        const repoResponse = await axios.get<{ userRepos: Repository[] }>(
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
    <>
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
                  <h1 className="text-lg sm:text-xl lg:text-xl font-semibold text-white mb-0.5 wrap-break-word">
                    {userProfile.username}
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-400 font-light wrap-break-word">
                    {userProfile.username.toLowerCase()}
                  </p>
                </div>

                {/* Bio */}
                {!!userProfile.bio?.[0]?.trim() && (
                  <div className="mb-2 sm:mb-3 text-center lg:text-left">
                    <p className="text-xs sm:text-sm text-gray-300 wrap-break-word">
                      {userProfile.bio?.[0]}
                    </p>
                  </div>
                )}

                {/* Edit Profile Button */}
                <button
                  onClick={openEditProfileModal}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-white transition-colors mb-2 sm:mb-3"
                >
                  Edit profile
                </button>

                <button
                  onClick={openChangePasswordModal}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-white transition-colors mb-2 sm:mb-3"
                >
                  Change password
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
                        className="w-3 h-3 sm:w-4 sm:h-4 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M1.75 1A1.75 1.75 0 000 2.75v11.5C0 15.216.784 16 1.75 16h12.5A1.75 1.75 0 0016 14.25V2.75A1.75 1.75 0 0014.25 1H1.75zM1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v11.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V2.75zM4 5a.75.75 0 000 1.5h8a.75.75 0 000-1.5H4zm0 3a.75.75 0 000 1.5h5a.75.75 0 000-1.5H4z"></path>
                      </svg>
                      <span className="wrap-break-word">{userProfile.company}</span>
                    </div>
                  )}

                  {userProfile.location && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"></path>
                      </svg>
                      <span className="wrap-break-word">{userProfile.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-400">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 shrink-0"
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
                        className="w-3 h-3 sm:w-4 sm:h-4 shrink-0"
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
                    className={`py-2 sm:py-3 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === "overview"
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
                    className={`py-2 sm:py-3 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === "repositories"
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
                    className={`py-2 sm:py-3 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === "stars"
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
                      <h2 className="text-xs sm:text-sm font-normal text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                        <Pin className="w-3.5 h-3.5 text-purple-400" fill="currentColor" />
                        Pinned
                      </h2>

                      {(() => {
                        const pinned = repositories.filter((r) => userProfile?.pinnedRepos?.includes(r.id)).slice(0, 6);
                        if (pinned.length === 0) {
                          return (
                            <div className="text-center py-8 sm:py-10 bg-gray-900 border border-gray-800 rounded-lg">
                              <Pin className="w-10 h-10 mx-auto text-gray-700 mb-2" />
                              <p className="text-gray-500 text-xs sm:text-sm">No pinned repositories yet</p>
                              <p className="text-gray-600 text-xs mt-1">Pin repos from your dashboard to feature them here</p>
                            </div>
                          );
                        }
                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {pinned.map((repo) => (
                              <div
                                key={repo.id}
                                className="p-3 sm:p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-purple-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h3 className="text-blue-400 font-semibold text-sm hover:underline cursor-pointer truncate">
                                    {repo.name}
                                  </h3>
                                  <Pin className="w-3.5 h-3.5 shrink-0 text-purple-400/70" fill="currentColor" />
                                </div>
                                <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                                  {repo.description || "No description provided"}
                                </p>
                                <div className="flex items-center gap-3 text-[10px] sm:text-xs text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <span className={`w-2 h-2 rounded-full ${repo.visibility ? "bg-green-500" : "bg-gray-500"}`} />
                                    {repo.visibility ? "Public" : "Private"}
                                  </span>
                                  <span>{repo.content.length} files</span>
                                  <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Contribution Activity */}
                    <div>
                      <h2 className="text-xs sm:text-sm font-normal text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                        <span>Contribution activity</span>
                      </h2>
                      <ContributionHeatmap userId={userProfile.id} />
                    </div>

                    {/* CLI Setup Guide */}
                    <div>
                      <CliSetupGuide />
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
                          <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors">
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
                                      className={`w-2 h-2 rounded-full ${repo.visibility
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
                                className={`shrink-0 p-2 rounded-lg border transition-all min-w-10 min-h-10 flex items-center justify-center ${userProfile?.starredRepos?.includes(repo.id)
                                  ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
                                  : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750 hover:border-gray-600 hover:text-yellow-500"
                                  }`}
                                title={
                                  userProfile?.starredRepos?.includes(repo.id)
                                    ? "Unstar"
                                    : "Star"
                                }
                              >
                                <svg
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                  fill={
                                    userProfile?.starredRepos?.includes(repo.id)
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
                                        className={`w-2 h-2 rounded-full ${repo.visibility
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
                                  className={`shrink-0 p-2 rounded-lg border transition-all min-w-10 min-h-10 flex items-center justify-center ${userProfile?.starredRepos?.includes(repo.id)
                                    ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
                                    : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750 hover:border-gray-600 hover:text-yellow-500"
                                    }`}
                                  title={
                                    userProfile?.starredRepos?.includes(repo.id)
                                      ? "Unstar"
                                      : "Star"
                                  }
                                >
                                  <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                    fill={
                                      userProfile?.starredRepos?.includes(repo.id)
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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl w-full max-w-md md:max-w-lg">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Edit Profile</h2>
                <button
                  onClick={closeEditProfileModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {editError && (
                  <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {editError}
                  </div>
                )}

                <div>
                  <label htmlFor="editUsername" className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="editUsername"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="your-username"
                    minLength={3}
                    maxLength={50}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-200 text-sm transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="editBio" className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="editBio"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell people about yourself"
                    rows={3}
                    maxLength={200}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-200 text-sm transition-all resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="editProfilePic" className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    id="editProfilePic"
                    value={editProfilePic}
                    onChange={(e) => setEditProfilePic(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-200 text-sm transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional. Add a URL, or upload from your device below.
                  </p>
                </div>

                <div>
                  <label htmlFor="editProfilePicUpload" className="block text-sm font-medium text-gray-300 mb-2">
                    Upload From Device
                  </label>
                  <input
                    type="file"
                    id="editProfilePicUpload"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Upload takes priority over URL.</p>

                  {(uploadedProfilePicData || editProfilePic || userProfile?.profilePic) && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={uploadedProfilePicData || editProfilePic || userProfile?.profilePic}
                        alt="Profile preview"
                        className="w-12 h-12 rounded-full object-cover border border-gray-700 bg-gray-800"
                      />
                      {uploadedProfilePicData && (
                        <button
                          type="button"
                          onClick={() => setUploadedProfilePicData("")}
                          className="text-xs px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700"
                        >
                          Remove uploaded image
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeEditProfileModal}
                    className="flex-1 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg transition-all"
                    disabled={isUpdatingProfile}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="flex-1 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl w-full max-w-md md:max-w-lg">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Change Password</h2>
                <button
                  onClick={closeChangePasswordModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                {passwordError && (
                  <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {passwordError}
                  </div>
                )}

                <div>
                  <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Old Password
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter your current password"
                    minLength={6}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-200 text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter a new password"
                    minLength={6}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-200 text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    minLength={6}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-200 text-sm transition-all"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeChangePasswordModal}
                    className="flex-1 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg transition-all"
                    disabled={isChangingPassword}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="flex-1 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                  >
                    {isChangingPassword ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : "Save password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Repository Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl w-full max-w-md md:max-w-lg">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Create New Repository</h2>
                <button
                  onClick={() => { setIsCreateModalOpen(false); setCreateError(""); setNewRepoName(""); setNewRepoDescription(""); setNewRepoVisibility(true); }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreateRepository} className="space-y-4">
                {createError && (
                  <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">{createError}</div>
                )}
                <div>
                  <label htmlFor="repoName" className="block text-sm font-medium text-gray-300 mb-2">
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
                  <label htmlFor="repoDescription" className="block text-sm font-medium text-gray-300 mb-2">
                    Description <span className="text-gray-500 text-xs">(Optional)</span>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
                  <div className="space-y-2">
                    <label
                      onClick={() => setNewRepoVisibility(true)}
                      className={`flex items-start p-3 bg-gray-800 border rounded-lg cursor-pointer transition-all ${newRepoVisibility === true ? "border-blue-500 ring-1 ring-blue-500/40" : "border-gray-700 hover:border-blue-500"}`}
                    >
                      <span className="mt-0.5 mr-3 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                        style={{ borderColor: newRepoVisibility === true ? "#3b82f6" : "#6b7280" }}>
                        {newRepoVisibility === true && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-white">Public</div>
                        <p className="text-xs text-gray-400 mt-0.5">Anyone can see this repository</p>
                      </div>
                    </label>
                    <label
                      onClick={() => setNewRepoVisibility(false)}
                      className={`flex items-start p-3 bg-gray-800 border rounded-lg cursor-pointer transition-all ${newRepoVisibility === false ? "border-blue-500 ring-1 ring-blue-500/40" : "border-gray-700 hover:border-blue-500"}`}
                    >
                      <span className="mt-0.5 mr-3 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                        style={{ borderColor: newRepoVisibility === false ? "#3b82f6" : "#6b7280" }}>
                        {newRepoVisibility === false && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-white">Private</div>
                        <p className="text-xs text-gray-400 mt-0.5">Only you can see this repository</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsCreateModalOpen(false); setCreateError(""); setNewRepoName(""); setNewRepoDescription(""); setNewRepoVisibility(true); }}
                    className="flex-1 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg transition-all"
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !newRepoName.trim()}
                    className="flex-1 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating...
                      </>
                    ) : "Create Repository"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default page;
