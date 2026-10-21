import jwt from 'jsonwebtoken';

// Auth Middleware: Yeh function check karta hai ki incoming request ke paas valid JWT token hai ya nahi
export const verifyToken = (req, res, next) => {
    // Request headers se 'Authorization' header nikal rahe hain
    const authHeader = req.headers.authorization;

    // Check karte hain ki header exist karta hai ya nahi aur 'Bearer ' se start hota hai ya nahi
    if (!authHeader ||!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided!' });
    }

    // 'Bearer <token>' format se sirf token string ko alag (extract) kar rahe hain
    const token = authHeader.split(' ')[1];

    // JWT_SECRET ka check - Ye lazmi hai
    if (!process.env.JWT_SECRET) {
        console.error('FATAL ERROR: JWT_SECRET is missing in.env');
        return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    try {
        // Token ko verify kar rahe hain JWT_SECRET key ke sath
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Decoded admin data ko request object mein attach kar rahe hain taaki aage ke controllers isay use kar sakein
        req.admin = decoded;

        // Agar token valid hai, toh request ko next middleware ya controller par pass kar do
        next();
    } catch (error) {
        console.error('Invalid Token:', error.message);
        // Agar token invalid ya expire ho gaya ho, toh 403 Forbidden response return karenge
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired! Please login again.' });
        }
        return res.status(403).json({ success: false, message: 'Invalid or expired token!' });
    }
};

// Alias taaki purane routes jo 'protect' naam se import kar rahe hain woh bhi chal jayein
// Ab ap chahe protect likho ya verifyToken, dono kaam karenge
export const protect = verifyToken;