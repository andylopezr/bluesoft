import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
  }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" })
  }

  const [bearer, token] = authHeader.split(" ")
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid token format" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string }
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid token" })
  }
}
