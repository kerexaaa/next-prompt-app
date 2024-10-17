import { Post } from "@app/api/prompt/route";
import PromptCard from "./PromptCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ProfileProps {
  name: string;
  desc: string;
  data: Post[];
  handleEdit?(post: Post): void;
  handleDelete?(post: Post): void;
}

const Profile = ({
  name,
  desc,
  data,
  handleEdit,
  handleDelete,
}: ProfileProps) => {
  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        {!name ? (
          <Skeleton />
        ) : (
          <span className="blue_gradient">{name} Profile</span>
        )}
      </h1>
      <p className="desc text-left">{name ? desc : <Skeleton />}</p>
      <div className="mt-10 prompt_layout">
        {data.map((post, index) => {
          return post ? (
            <PromptCard
              key={index}
              post={post}
              handleEdit={() => handleEdit && handleEdit(post)}
              handleDelete={() => handleDelete && handleDelete(post)}
            ></PromptCard>
          ) : (
            <div className="prompt_card">
              <Skeleton className="prompt_card" key={index} height={170} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Profile;
