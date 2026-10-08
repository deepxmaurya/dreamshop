import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../config/databases";

export const login = async (
    req: Request,
    res: Response
) => {
    const { username, password } = req.body;

    console.log("Username received:", username);
    console.log("Password received:", password);

    try {
        const [rows] = await pool.query(
            "SELECT * FROM register WHERE username = ?",
            [username]
        );

        console.log("Database result:", rows);

        const users = rows as any[];

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Pehle user ko variable mein store karenge
        const user = users[0];

        console.log("DB username:", user.username);
        console.log("DB password:", user.password);
        console.log("Entered password:", password);

        // Password check
        if (password !== user.password) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // JWT create
        const token = jwt.sign(
            {
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1d"
            }
        );

        // Cookie mein JWT
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({
            message: "Login successful"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Login failed"
        });
    }
};