"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Profile from "@components/Profile";
import { Post } from "@app/api/prompt/route";
import { IUser } from "@models/user";

const ProfilePage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchPosts();
      fetchProfile();
      setIsLoading(false);
    }
  }, [id]);

  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<IUser>();

  const fetchPosts = async () => {
    const response = await fetch(`/api/users/${id}/posts`);
    const data: Post[] = await response.json();

    setPosts(data);
  };

  const fetchProfile = async () => {
    const response = await fetch(`/api/users/${id}/user`);

    if (response.status === 404) {
      const userNotFound: IUser = {
        email: "",
        image: "",
        username: "There is no user with this id.",
      };

      return (
        <Profile
          name={userNotFound.username}
          desc={`Seems like he's gone`}
          data={[]}
        />
      );
    }

    const data: IUser = await response.json();

    setUser(data);
  };

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
