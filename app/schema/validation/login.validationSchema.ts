import * as yup from "yup";
import hash from "../../helpers/hash";
import User from "../../models/User";
import { IUser } from "../interface/IUser";

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required()
    .test("validLogin", "invalid email or password", async function (email) {
      const user = <IUser>await User.getUserByEmail(email!);
      if (!user) return false;

      const correctPassword = await hash.compare(
        <string>this.parent.password,
        user.password!
      );
      if (!correctPassword) return false;

      return true;
    }),
  password: yup.string().required(),
});

export default loginValidationSchema;
