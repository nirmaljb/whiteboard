import { JWT_SECRET } from "@repo/backend-common/config";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const authMiddleWare: RequestHandler = (req: any, res, next) => {
    const authToken = req.headers.authorization;

    if(!authToken) {
        return res.status(401).json({ message: 'Invalid or Missing token' });
    }

    const decoded = jwt.verify(authToken, JWT_SECRET);
    
    if(decoded) {
        // @ts-ignore
        req.userId = decoded.userId;
        next();
    }
    // return next();
}

export default authMiddleWare;
