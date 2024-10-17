"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Profile from "@components/Profile";
import { Post } from "@app/api/prompt/route";
import { IUser } from "@models/user";

const ProfilePage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchProfile();
      fetchPosts();
      setIsLoading(false);
    }
  }, [id]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/users/${id}/posts`);

      if (!response.ok) {
        if (response.status === 404) {
          setPosts([]);
        } else {
          throw new Error(`Error fetching posts: ${response.status}`);
        }
        return;
      }

      const data: Post[] = await response.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch posts.");
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${id}/user`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("User not found");
          setUser(undefined);
        } else {
          throw new Error(`Error fetching user: ${response.status}`);
        }
        return;
      }

      const data: IUser = await response.json();
      setUser(data);
    } catch (err) {
      console.error("An error occured", err);
      setError("Failed to fetch user profile.");
    }
  };

  if (error) {
    return (
      <Profile
        data={posts}
        desc={`There's no user with this id!`}
        name="User not found!"
      />
    );
  }

  return (
    <>
      {!isLoading ? (
        <Profile
          name={user?.username || ""}
          desc={`Welcome to ${user?.username || ""} personalized profile page!`}
          data={posts}
        />
      ) : (
        <Profile
          name={user?.username || ""}
          desc={`Welcome to ${user?.username || ""} personalized profile page!`}
          data={Array(3).fill(null)}
        />
      )}
    </>
  );
};

export default ProfilePage;
