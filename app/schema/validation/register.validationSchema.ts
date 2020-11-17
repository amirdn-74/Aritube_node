import * as yup from "yup";
import User from "../../models/User";

const registerValidationSchema = yup.object().shape({
  name: yup.string().min(5).max(50).required().label("Name"),
  email: yup
    .string()
    .email()
    .required()
    .label("Email")
    .test("unique email", "this email is already taken", async (email) => {
      const user = await User.getUserByEmail(email!);

      if (user) return false;
      return true;
    }),
  password: yup.string().min(6).max(59).required().label("Password"),
  confirmPassword: yup
    .string()
    .required()
    .label("Confirm Password")
    .test("match password", "passwords are not match", function (
      confirmPassword
    ) {
      if (this.parent.password !== confirmPassword) return false;
      return true;
    }),
});

export default registerValidationSchema;
