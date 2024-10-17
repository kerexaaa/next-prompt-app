import { Post } from "@app/api/prompt/route";
import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { Types } from "mongoose";

export interface DynamicParams {
  id: string;
}

export const GET = async (
  req: Request,
  { params }: { params: DynamicParams }
) => {
  try {
    await connectToDB();

    const prompts: Post[] = await Prompt.find({
      creator: params.id,
    }).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all posts", { status: 500 });
  }
};
