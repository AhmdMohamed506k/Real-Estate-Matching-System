import { Usermodel } from "../../../DB/Models/User.model.js";
import jwt from "jsonwebtoken";

const Auth = async (req, res, next) => {
   
    const { token } = req.headers;

   
    if (!token) {
        return res.status(401).json({ message: 'You are not authorized, no token provided' });
    }

    try {
       
        const decoded = jwt.verify(token, process.env.tokenKey);
      
        const user = await Usermodel.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User no longer exists' });
        }

       
        req.user = user;
        next();
    } catch (error) {
      
        return res.status(401).json({ message: 'Sorry, Invalid or Expired Token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Forbidden: Your role (${req.user.role}) is not allowed to perform this action` 
            });
        }
        next();
    };
};

export { Auth, authorize };