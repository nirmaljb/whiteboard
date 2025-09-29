import express from "express";
import authMiddleWare from "./middleware/auth.middlware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { signUpSchema, signInSchema } from "@repo/common/types";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ message: "Backend is healthy!" });
});

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    const zodValidation = signUpSchema.safeParse(req.body);
    if(!zodValidation.success) {
        return res.status(400).json({ success: false, message: 'Invalid inputs' })
    }

    res.json({ success: true, payload: { username, email, password } });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const zodValidation = signInSchema.safeParse(req.body);
    
    if(!zodValidation.success) {
        return res.status(400).json({ success: false, message: 'Invalid inputs' })
    }
    
    const token = jwt.sign({ sub: email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token: token });
});

app.get('/token', authMiddleWare, (req, res) => {
    res.json({ message: 'Protected route' });
});

app.listen(8000);


