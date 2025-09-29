import express from "express";
import authMiddleWare from "./middleware/auth.middlware";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    console.log()
    res.json({ message: "Backend is healthy!" });
});

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    res.json({ success: true, payload: req.body });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const token = jwt.sign({ sub: email }, 'secret', { expiresIn: '1h' });
    res.json({ success: true, token: token });
});

app.get('/token', authMiddleWare, (req, res) => {
    res.json({ message: 'Protected route' });
});

app.listen(8000);


