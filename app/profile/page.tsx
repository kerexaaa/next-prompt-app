"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Profile from "@components/Profile";
import { Post } from "@app/api/prompt/route";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (session?.user.id) {
      fetchPosts();
    }
  }, [session?.user.id]);

  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/users/${session?.user.id}/posts`);
    const data: Post[] = await response.json();

    setPosts(data);
    setIsLoading(false);
  };

  const handleEdit = (post: Post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const handleDelete = async (post: Post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete that prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = posts.filter(
          (item: Post) => item._id !== post._id
        );

        setPosts(filteredPosts);
      } catch (error) {
        console.error(`An error occured,`, error);
      }
    }
  };

  return (
    <>
      {!isLoading ? (
        <Profile
          name="My"
          desc="Welcome to your personalized profile page!"
          data={posts}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ) : (
        <Profile
          name="My"
          desc="Welcome to your personalized profile page!"
          data={Array(6).fill(null)}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default ProfilePage;
