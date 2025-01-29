import 'module-alias';
import user from "../../models/user.js";
import jwt from 'jsonwebtoken'

const secretkey=process.env.SECRET_KEY;

export async function signupUser(req, res) {
    const { username, password } = req.body;
    try {
        const user_data = await user.create({
            username: username,
            password: password,
        });
        const token = jwt.sign({ username: username, _id: user_data._id }, secretkey, { expiresIn: '10h' });
        res.cookie('token', token, {
            httpOnly: true,  
            secure: process.env.NODE_ENV === 'production',  
            sameSite: 'None',  
            maxAge: 3600000,  
            domain: process.env.API_URL,
        });
        res.status(201).json({ id: user_data._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function loginUser(req, res) {
    const { username, password } = req.body;
    try {
        const user_data = await user.findOne({ username, password });
        if (!user_data) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign(
            { username: user_data.username, _id: user_data._id },
            secretkey,
            { expiresIn: '10h' }
        );
        res.cookie('token', token, {
            httpOnly: true,  
            secure: process.env.NODE_ENV === 'production',  
            sameSite: 'None',  
            maxAge: 3600000,  
            domain: process.env.API_URL,
        });
        return res.status(200).json({ id: user_data._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
