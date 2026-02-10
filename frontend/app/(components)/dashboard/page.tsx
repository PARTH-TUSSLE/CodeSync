"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

function page() {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    const fetchUserRepos = async () => {
      const response = await axios.get(`http://localhost:8000/allRepos`);
      const allRepos = await response.data.repos;
      console.log(allRepos);
      setSuggestedRepositories(allRepos);
    };
    fetchUserRepos();
  }, []);

  useEffect(() => {
    
  }, [])

  return <div></div>;
}

export default page;
