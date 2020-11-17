import bcrypt from "bcryptjs";

const generate = async (password: string) => {
  const salt = await bcrypt.genSalt(12);

  return bcrypt.hash(password, salt);
};

const compare = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export default {
  generate,
  compare,
};
