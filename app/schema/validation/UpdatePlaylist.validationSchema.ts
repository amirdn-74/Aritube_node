import * as yup from "yup";

const updatePlaylistValidationSchema = () => {
  return yup.object().shape({
    name: yup.string().min(3).max(29).required(),
  });
};

export default updatePlaylistValidationSchema;
