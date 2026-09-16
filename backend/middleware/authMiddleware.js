const jsonwebtoken = require('jsonwebtoken')

//Vérification token présent 
exports.token = (req, res, next) => {
    const authToken = req.headers.authorization;
    const token = authToken && authToken.split(" ")[1];
    if(!token) {
        return res.status(401).json({ message: "Access token required" });
    } try {
        const decoded = jsonwebtoken.verify(
            token,
            process.env.JWT_SECRET
        );
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or exprired token" });
    }

}