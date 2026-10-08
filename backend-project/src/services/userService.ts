  import {getAllUsers} from "../models/userModel"

  export async function fetchAllUsers(){
       const users = await getAllUsers();

    return users;

  }