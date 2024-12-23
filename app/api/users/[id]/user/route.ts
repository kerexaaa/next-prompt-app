import User, { IUser } from "@models/user";
import { connectToDB } from "@utils/database";
import { HydratedDocument } from "mongoose";

export interface DynamicParams {
  id: string;
}

export const GET = async (
  req: Request,
  { params }: { params: DynamicParams }
) => {
  try {
    await connectToDB();

    const userExists: HydratedDocument<IUser> | null = await User.findOne({
      _id: params.id,
    });

    if (!userExists) {
      return new Response(`Profile not found!`, {
        status: 404,
      });
    }

    return new Response(JSON.stringify(userExists), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all posts", { status: 500 });
  }
};
