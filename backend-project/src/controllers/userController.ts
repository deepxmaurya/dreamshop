import { Request, Response } from "express";
import { fetchAllUsers } from "../services/userService";

export async function getUsers(req: Request, res: Response) {
    try {
      const users = await fetchAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users"
        });
    }
}