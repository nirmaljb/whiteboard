import { JWT_SECRET } from "@repo/backend-common/config";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const authMiddleWare: RequestHandler = (req: any, res, next) => {
    const authToken = req.headers.authorization;
    const token = authToken.split(" ")[1];
    
    if(!authToken || !token) {
        return res.status(401).json({ message: 'Invalid or Missing token' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded) {
            // @ts-ignore
            req.userId = decoded.sub?.user_id;
            next();
        }
    }catch(err) {
        return res.status(401).json({ message: 'Invalid or Missing token' });
    }
    // return next();
}

export default authMiddleWare;
