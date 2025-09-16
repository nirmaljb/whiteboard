import express from "express";

const app = express();
app.use(express());

app.get('/health', (req, res) => {
    res.json({ message: "Backend is healthy!" });
});

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    res.json({ success: true, payload: req.body });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    res.json({ success: true, payload: req.body });
})

app.listen(8000);


