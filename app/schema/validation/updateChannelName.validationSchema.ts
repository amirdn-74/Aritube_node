import { Request } from "express";
import * as yup from "yup";
import Channel from "../../models/Channel";
import { IChannel } from "../interface/IChannel";

const updateChannelNameValidatioSchema = (req: Request) => {
  return yup.object().shape({
    channelName: yup
      .string()
      .min(3)
      .max(29)
      .required()
      .test(
        "uniqueName",
        "this name has already been taken",
        async (channelName) => {
          const channelByName = <IChannel>(
            await Channel.findOne({ name: channelName })
          );
          if (channelByName) return false;
          return true;
        }
      ),
  });
};

export default updateChannelNameValidatioSchema;
