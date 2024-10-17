// GET
// PATCH
// DELETE

import { connectToDB } from "@utils/database";
import { Post } from "../route";
import { DynamicParams } from "@app/api/users/[id]/posts/route";
import Prompt, { IPrompt } from "@models/prompt";
import { HydratedDocument } from "mongoose";

export const GET = async (
  request: Request,
  { params }: { params: DynamicParams }
) => {
  try {
    await connectToDB();

    const prompt: Post = await Prompt.findById(params.id).populate("creator");
    if (!prompt) {
      return new Response(`Prompt not found!`, { status: 404 });
    }
    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Failed to handle action on post", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: DynamicParams }
) => {
  const { prompt, tag } = await req.json();

  try {
    await connectToDB();

    const existingPrompt: HydratedDocument<IPrompt> | null =
      await Prompt.findById(params.id);
    if (!existingPrompt) {
      return new Response(`Prompt not found!`, { status: 404 });
    }
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    return new Response(`There was an error while updating prompt ${error}`, {
      status: 500,
    });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: DynamicParams }
) => {
  try {
    await connectToDB();

    await Prompt.findOneAndDelete({ _id: params.id });

    return new Response("Prompt deleted successfully!", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete prompt", { status: 500 });
  }
};
