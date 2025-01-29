import jwt from 'jsonwebtoken';

const secretkey = process.env.SECRET_KEY;  

export async function authentication(req, res, next) {
    const token = req.cookies.token;  
    if (!token) {
        return res.status(401).json({ message: secretkey });  
    }
    
    jwt.verify(token, secretkey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });  
        }
        req._id = decoded._id;  
        next();  
    });
}
