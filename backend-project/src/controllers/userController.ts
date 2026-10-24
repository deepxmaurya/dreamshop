import { Request, Response } from "express";
import { fetchAllUsers } from "../services/userService";
import { fetchAllRegisteredUsers } from "../services/userService";

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




export async function getRegister(
    req: Request,
    res: Response
) {
    try {
        const users = await fetchAllRegisteredUsers();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch registered users"
        });
    }
}