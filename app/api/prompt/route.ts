import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { Types } from "mongoose";

export interface Creator {
  _id: Types.ObjectId;
  email: string;
  username: string;
  image: string;
  __v: number;
}

export interface Post {
  _id: Types.ObjectId;
  creator: Creator;
  prompt: string;
  tag: string;
  __v: number;
}

export const GET = async (request: Request) => {
  try {
    await connectToDB();

    const prompts: Post[] = await Prompt.find({}).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all posts", { status: 500 });
  }
};
