import * as yup from "yup";

const updateChannelAboutValidationSchema = () => {
  return yup.object().shape({
    about: yup.string().max(1999).required(),
  });
};

export default updateChannelAboutValidationSchema;
