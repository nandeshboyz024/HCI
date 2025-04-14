import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import { neon } from '@neondatabase/serverless';

dotenv.config();
const sql = neon(process.env.DATABASE_URL);
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/show-my-id", async (req, res) => {
    try {
        const result = await sql`SELECT * FROM "Admin"`;
        const admin = result[0];
        res.send(`
            <h1>Admin Username: ${admin.username}</h1>
            <h1>Admin Password: ${admin.password}</h1>
        `);
    } catch (error) {
        console.error("Error fetching admin:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/varify-admin", async (req, res) => {
    try {
        const result = await sql`SELECT * FROM "Admin"`;
        const admin = result[0];
        const { username, password } = req.body;

        if (username === admin.username && password === admin.password) {
            res.json({
                success: true,
                message: "Admin is verified successfully!"
            });
        } else {
            res.json({
                success: false,
                message: "Admin verification failed!"
            });
        }
    } catch (error) {
        console.error("Error verifying admin:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

app.listen(5000, () => {
    console.log("Server is working!");
});
