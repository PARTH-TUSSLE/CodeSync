"use client";
import axios from 'axios';
import React, { useEffect } from 'react'

function page() {
  interface userProfile {
    username: string;
    email: string;
    following: [];
    followers: [];
    starredRepos: [];
  }
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const fetchUser = async () => {
      const response = await axios.get(
        `http://localhost:8000/userProfile/${userId}`,{headers: {
          Authorization: `Bearer ${token}`
        }}
      );
      const userProfile = response.data.user
      console.log(userProfile);
    }

    fetchUser();

  }, [])
  return (
    <div>
      Profile
    </div>
  )
}

export default page
