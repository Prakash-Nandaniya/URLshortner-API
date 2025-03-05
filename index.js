import 'module-alias/register.js';
import express from 'express';
import connectDB from './connections.js';
import cookie_parser from 'cookie-parser';
import root from './routes/root.js';
import cors from 'cors';
import dotenv from 'dotenv/config.js';
const app = express();
const port = process.env.PORT ;
connectDB().then(() => {
    app.listen(port , () => { console.log(`server started on port ${port}`) });
});


const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            // Allow requests with no origin (like Postman or mobile apps)
            return callback(null, true);
        }

        // Allow any origin by dynamically reflecting it
        callback(null, origin);
    },
    credentials: true, // Allow credentials (cookies, auth headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Use CORS middleware with dynamic origin support
app.use(cors(corsOptions));

// Handle preflight (OPTIONS) requests globally
app.options('*', cors(corsOptions));


app.param('id', (req, res, next, id) => {
    req.params.id = id;
    next();
});

app.use(express.json());
app.use(cookie_parser());
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.use('/', root); 


export default app;
