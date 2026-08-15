import jwt from 'jsonwebtoken';

export const authenticationToken = (req,res,next)=>{
    const  token = req.header("Authorization");
    if(!token) return res.status(401).json({message: "Access denied: No token Provided"})

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decode;
            next();
        } catch (error) {
            res.status(500).json({
                message: "something went wrong",
                error: error.message
            })
        }
}