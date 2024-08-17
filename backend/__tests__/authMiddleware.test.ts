import { NextFunction, Response } from "express"
import jwt from "jsonwebtoken"
import { authMiddleware, AuthRequest } from "../src/middleware/authMiddleware"

jest.mock("jsonwebtoken")

describe("authMiddleware", () => {
  let req: Partial<AuthRequest>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {
      headers: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  it("should return 401 if no Authorization header is provided", () => {
    authMiddleware(req as AuthRequest, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" })
  })

  it("should return 401 if Authorization header format is invalid", () => {
    req.headers!.authorization = "InvalidFormat"

    authMiddleware(req as AuthRequest, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token format" })
  })

  it("should return 401 if token is invalid", () => {
    req.headers!.authorization = "Bearer invalidtoken"
    ;(jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token")
    })

    authMiddleware(req as AuthRequest, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" })
  })

  it("should call next if token is valid", () => {
    req.headers!.authorization = "Bearer validtoken"
    ;(jwt.verify as jest.Mock).mockReturnValue({
      id: "123",
      email: "test@example.com",
    })

    authMiddleware(req as AuthRequest, res as Response, next)

    expect(req.user).toEqual({ id: "123", email: "test@example.com" })
    expect(next).toHaveBeenCalled()
  })
})
