  import {getAllUsers} from "../models/userModel"
import pool from "../config/databases";
  export async function fetchAllUsers(){
       const users = await getAllUsers();

    return users;

  }

  export async function fetchAllRegisteredUsers() {
    const [rows] = await pool.query(
        "SELECT id, username, role FROM register"
    );

    return rows;
}