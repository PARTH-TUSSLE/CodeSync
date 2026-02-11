"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

function page() {

  interface Repository {
    id: string,
    name: string,
    description?: string,
    content: string[],
    visibility: boolean,
    ownerId: string,
    createdAt: Date,
    updatedAt: Date
  }

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestedRepositories, setSuggestedRepositories] = useState<Repository[]>([]);
  const [searchResults, setSearchResults] = useState<Repository[]>([]);


    useEffect(() => {

      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      console.log("userId",userId);
      console.log("token",token);

      const fetchUserRepos = async () => {
        const response = await axios.get(
          `http://localhost:8000/repo/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const userRepos = await response.data.userRepos;
        console.log(userRepos);
        setRepositories(userRepos);
      };
      fetchUserRepos();
    }, []);

  useEffect(() => {
    const fetchAllRepos = async () => {
      const response = await axios.get(`http://localhost:8000/allRepos`);
      const allRepos = await response.data.repos;
      console.log(allRepos);
      setSuggestedRepositories(allRepos);
    };
    fetchAllRepos();
  }, []);

  useEffect(() => {
    
  }, [])

  useEffect(() => {
    if (searchQuery ===  "") {
      setSearchResults(repositories);
    }
    const filteredRepos = repositories.filter((repo) => {
      repo.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    setSearchResults(filteredRepos);
  }, [])

  return <div></div>;
}

export default page;
