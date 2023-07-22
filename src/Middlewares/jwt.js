import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_PRIMARY_KEY, { expiresIn: "15m" });
}

export function verifyToken(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(403)
      .json({ message: "No se proporcionó un token válido." });
  }
  jwt.verify(token, process.env.JWT_PRIMARY_KEY, (error, data) => {
    if (error) {
      return res.status(401).json({ message: "Token inválido o caducado." });
    }
    req.user = data;
    next();
  });
}
