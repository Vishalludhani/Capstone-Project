import jwt from "jsonwebtoken"
import { config } from 'dotenv'
config()

export const verifyToken = (...allowedRoles) => {
    return async (req, res, next) => {

        try {
            //read token from req
            let token = req.cookies.token
            //verify token validity
            if (token == undefined) {
                return res.status(400).json({ message: "Unauthorized req.Please Login" })
            }
            let decodedToken = jwt.verify(token, process.env.JWT_SECRET)

            // check if role is allowed
            if (!allowedRoles.includes(decodedToken.role)) {
                return res.status(403).json({ message: "Forbidden, You dont have permission" })
            }

            // attach user info to for use in routes
            req.user = decodedToken;

            //forward req
            next()
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Serrion expired. please login" })
            }
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({ message: "Invalid token. please login again" })
            }
            // next(error)
        }
    }
}