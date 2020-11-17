import { Request } from "express";
import * as yup from "yup";
import Channel from "../../models/Channel";

const createChannelValidationSchema = (req: Request) => {
  return yup.object().shape({
    name: yup
      .string()
      .min(3)
      .max(29)
      .required()
      .test("unique userId", "you already created a channel", async () => {
        const channel = await Channel.findOne({ userId: req.user._id });
        if (channel) return false;
        return true;
      })
      .test(
        "unique channel name",
        "this channel name has already been taken",
        async (name) => {
          const channel = await Channel.findOne({ name });
          if (channel) return false;
          return true;
        }
      ),
  });
};

export default createChannelValidationSchema;
