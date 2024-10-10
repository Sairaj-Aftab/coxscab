import jwt from "jsonwebtoken";

// Create Token
export const createToken = (payload, exp) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: exp,
  });

  return token;
};

// JWT Verify
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
