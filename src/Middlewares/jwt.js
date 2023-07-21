import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_PRIMARY_KEY, { expiresIn: "5m" });
  }
  
export  function verifyToken(authorization) {
  try {
    const decode = jwt.verify(authorization, process.env.JWT_PRIMARY_KEY);
    return decode;
  } catch (err) {
    return "Acces Denied o expired";
  }
  }

