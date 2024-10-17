import { Schema, model, models } from "mongoose";

export interface IPrompt {
  prompt: string;
  tag: string;
  creator: Schema.Types.ObjectId;
}

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required!"],
  },
  tag: {
    type: String,
    required: [true, "Tag is required!"],
  },
});

const Prompt = models.Prompt || model<IPrompt>("Prompt", PromptSchema);

export default Prompt;
