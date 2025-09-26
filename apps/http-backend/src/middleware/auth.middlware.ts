import express, { NextFunction, RequestHandler } from "express";

const authMiddleWare: RequestHandler = (req: any, res, next) => {
    const authToken = req.headers.authorization;

    if(!authToken) {
        return res.status(401).json({ message: 'Invalid or Missing token' });
    }
    
    return next();
}

export default authMiddleWare;
