import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/databases";

export const register = async (req: Request, res: Response) => {

    const { username, password, role } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO register (username, password, role)
             VALUES (?, ?, ?)`,
            [username, hashedPassword, role]
        );

        return res.status(201).json({
            message: "Account created successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Registration failed"
        });
    }
};