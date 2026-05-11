import * as authService from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV !== "development",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const signup = async (req, res, next) => {
    try{
        const { user, token } = await authService.signup(req.body);
        
        res.cookie("jwt", token, cookieOptions);

        res.status(201).json(user);

    } catch (error) {
        next(error)
    }    
}

export const login = async (req, res, next) => {
    try{
        const { user,token } = await authService.login(req.body);
        res.cookie("jwt", token,cookieOptions);
        res.status(200).json(user);

    } catch (error) {
        next(error)
    } 
};

export const googleCallback = async (req, res, next) => {
    try {
        const {token} = await authService.googleCallback(req.user); // Passport sets this

        res.cookie("jwt", token, cookieOptions);

        // Redirect to frontend home page
        res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");

    } catch (error) {
        next(error)
    }
};

export const forgotPassword = async (req, res, next) => {
    try{
        const result = await authService.forgotPassword(req.body.email);

        res.status(200).json(result);
    }catch(error){
        next(error)
    }
};

export const resetPassword = async (req, res, next) => {
    try{
        const result = await authService.resetPassword(req.params.token,req.body.password);

        res.status(200).json(result);
    }catch(error){
        next(error)
    }
};

export const logout = (req, res, next) => {
    try {
        res.cookie("jwt", "",{
            ...cookieOptions,
            maxAge:0,
        });
        res.status(200).json({ message: "Logged Out Successfully" })
    } catch (error) {
        next(error)
    }
}

export const checkAuth = (req, res, next) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        next(error)
    }
}

export const updateProfile = async (req, res,next) => {
    try{
        const updatedUser = await authService.updateProfile(req.user._id,req.body.profilePic);
        res.status(200).json(updatedUser);

    } catch (error) {
        next(error)
    } 
}