import express from "express";
import jwt from "jsonwebtoken";
import authMiddleWare from "./middleware/auth.middlware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { Client } from "@repo/db/client";
import { signUpSchema, signInSchema, roomSchema } from "@repo/common/types";

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ message: "Backend is healthy!" });
});
app.post('/signup', async (req, res) => {
    const zodValidation = signUpSchema.safeParse(req.body);
    if(!zodValidation.success) {
        return res.status(400).json({ success: false, message: 'Invalid inputs' })
    }

    try {
        const user = await Client.user.create({
            data: {
                ...zodValidation.data
            }
        });
        res.status(201).json({ success: true, user_id: user.unique_id });
    }catch( err ) {
        return res.status(400).json({ success: false, message: 'User already exists'});
    }
});

app.post('/signin', async (req, res) => {
    const zodValidation = signInSchema.safeParse(req.body);
    
    if(!zodValidation.success) {
        return res.status(400).json({ success: false, message: 'Invalid inputs' })
    }
    const user = await Client.user.findUnique({
        where: {
            email: zodValidation.data.email
        }
    });
    
    if(!user || user?.password !== zodValidation.data.password) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }
        
    const token = jwt.sign({ sub: { email: zodValidation.data.email, username: user.username, user_id: user.unique_id } }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ success: true, token: token });
});

app.post('/create-room', authMiddleWare, async (req, res) => {
    const zodValidation = roomSchema.safeParse(req.body);
    if(!zodValidation.success) {
        return res.status(400).json({ success: false, message: 'Invalid inputs' });
    }

    try {
        const room = await Client.room.create({
            data: {
                slug: zodValidation.data.slug,
                //@ts-ignore
                admin_id: req.userId
            }
        });
        return res.status(201).json({ message: 'Protected route', room_id: room.id });
    }catch (err) {
        return res.json({ message: 'Room already exists' })
    }
});

app.listen(8000);


