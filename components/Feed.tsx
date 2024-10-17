"use client";

import { useEffect, useRef, useState } from "react";
import PromptCard from "./PromptCard";
import { Post } from "@app/api/prompt/route";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface PromptCardListProps {
  data: Post[];
  handleTagClick(value: string): void;
}

const PromptCardList = ({
  data,
  handleTagClick,
}: PromptCardListProps): React.ReactNode => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post, index) => {
        return post ? (
          <PromptCard
            key={index}
            post={post}
            handleTagClick={handleTagClick}
          ></PromptCard>
        ) : (
          <div className="prompt_card">
            <Skeleton
              className="prompt_card"
              key={index}
              height={120}
            />
          </div>
        );
      })}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [originalPosts, setOriginalPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const inputFormRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    const response = await fetch("/api/prompt");
    const data: Post[] = await response.json();

    setPosts(data);
    setOriginalPosts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  console.log(posts);
  console.log(originalPosts);

  const handleSearchInput = (value: string) => {
    if (value === "") {
      setPosts(originalPosts);
      return;
    }

    const filteredPosts = originalPosts.filter(
      (post) =>
        post.prompt.toLowerCase().includes(value.toLowerCase()) ||
        post.tag.toLowerCase().includes(value.toLowerCase()) ||
        post.creator.username.toLowerCase().includes(value.toLowerCase())
    );

    setPosts(filteredPosts);
  };

  const handleTagClick = (value: string) => {
    if (inputFormRef.current) {
      inputFormRef.current.focus();
    }
    setSearchText(value);
  };

  useEffect(() => {
    const handleTimeout = setTimeout(() => {
      handleSearchInput(searchText);
    }, 300);

    return () => clearTimeout(handleTimeout);
  }, [searchText]);

  return (
    <section className="feed">
      <form
        className="relative w-full flex-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputFormRef}
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          required
          className="search_input peer"
        />
      </form>
      {!isLoading ? (
        <PromptCardList
          data={posts}
          handleTagClick={(e) => handleTagClick(e)}
        />
      ) : (
        <PromptCardList data={Array(3).fill(null)} handleTagClick={() => {}} />
      )}
    </section>
  );
};

export default Feed;
