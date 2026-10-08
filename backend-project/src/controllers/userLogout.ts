import { Request, Response } from "express";
export const logout = (req: Request, res: Response) => {

    res.clearCookie("auth_token");

    return res.json({
        message: "Logout successful"
    });
};

export const getMe = (req: Request, res: Response) => {

    return res.json({
        message: "User is authenticated"
    });
};