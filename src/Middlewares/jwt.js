import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_PRIMARY_KEY, { expiresIn: "5m" });
  }
  
export  function verifyToken() {
    const { authorization } = req.cookies;
    if (!authorization) res.send("Acces Denied");
  
    jwt.verify(authorization, process.env.JWT_PRIMARY_KEY, (err, decode) => {
      if (err) {
        res.send("Acces Denied o expired");
      } else {
        req.user = decode;
      }
    });
  }

