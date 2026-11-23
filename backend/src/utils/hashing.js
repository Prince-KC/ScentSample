import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(password, salt);
  return hash;
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
