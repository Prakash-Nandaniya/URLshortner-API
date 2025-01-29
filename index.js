import 'module-alias/register.js';
import express from 'express';
import connectDB from './connections.js';
import cookie_parser from 'cookie-parser';
import root from './routes/root.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(port , () => { console.log(`server started on port ${port}`) });
});

const corsOptions = {
    origin:'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));


app.param('id', (req, res, next, id) => {
    req.params.id = id;
    next();
});

app.use(express.json());
app.use(cookie_parser());
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.use('/', root); 
