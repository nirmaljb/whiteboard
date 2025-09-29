import express from "express";
import jwt from "jsonwebtoken";
import authMiddleWare from "./middleware/auth.middlware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { Client } from "@repo/db/client";
import { signUpSchema, signInSchema } from "@repo/common/types";

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ message: "Backend is healthy!" });
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    const zodValidation = signUpSchema.safeParse(req.body);
    if(!zodValidation.success) {
        return res.status(400).json({ success: false, message: 'Invalid inputs' })
    }

    await Client.user.create({
        data: {
            ...zodValidation.data
        }
    });
    res.json({ success: true, payload: { username, email, password } });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const zodValidation = signInSchema.safeParse(req.body);
    
    if(!zodValidation.success) {
        return res.status(400).json({ success: false, message: 'Invalid inputs' })
    }

    const user = await Client.user.findUnique({
        where: {
            email: zodValidation.data.email
        }
    });

    if(user?.password !== zodValidation.data.password) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const token = jwt.sign({ sub: email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token: token });
});

app.get('/room', authMiddleWare, (req, res) => {
    res.json({ message: 'Protected route' });
});

app.listen(8000);


