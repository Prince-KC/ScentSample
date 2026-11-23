import jwt from "jsonwebtoken";

const SECRET_KEY = "SCENT_SAMPLE_NEPAL_SECRET_KEY_2026";

export const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
};

export const verifyTokenString = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
};
