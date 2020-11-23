import * as yup from "yup";

const updateChannelAboutValidationSchema = () => {
  return yup.object().shape({
    about: yup.string().max(199).required(),
  });
};

export default updateChannelAboutValidationSchema;
