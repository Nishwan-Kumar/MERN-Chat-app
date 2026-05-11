import jwt from "jsonwebtoken";
export const generate_token = (userId)=>{
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}