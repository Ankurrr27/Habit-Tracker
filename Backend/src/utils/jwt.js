import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // 🔥 MUST be `id`
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
