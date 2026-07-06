import "./models/index.js";

import express from 'express';
import "dotenv/config";
import cors from 'cors';
import queryHandler from './middlewares/queryHandler.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import dbConnection from './configs/dbConnection.js';

import indexRouter from './routes/index.js';

const app = express()

app.use(express.json());

// CORS:
const allowedOrigins = [
    "https://daily-blog-web.vercel.app",
    "http://localhost:5173"
];

app.use(cors({
    origin: allowedOrigins
}));



// Nested Query
app.set("query parser", "extended");

// Query Handler:
app.use(queryHandler);

// Routes:
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;

app.all("/health", (req: express.Request, res: express.Response) => {
    res.status(200).json({ status: "ok" });
});

app.use(notFound).use(errorHandler);

await dbConnection();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



export default app;