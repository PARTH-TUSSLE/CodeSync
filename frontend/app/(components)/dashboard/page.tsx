"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

function page() {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);


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

  return <div></div>;
}

export default page;
