import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()
const db=process.env.DBURL;
 

async function dbconnection(){
    try {
        mongoose.connect(db)
        console.log("Connected to Database Successfully ")
    } catch (error) {
        console.log(`Error connecting to Mongo db pls Check: ${error} `);
        throw error
    }
}

export const client=dbconnection




