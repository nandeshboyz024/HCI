import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import { neon } from '@neondatabase/serverless';


dotenv.config();
const sql = neon(process.env.DATABASE_URL);
const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());



app.get("/show-my-id",async(req,res)=>{
    const result = await sql`SELECT * FROM "Admin"`;
    const admin = result[0];
    res.send(`
        <H1>Admin Username: ${admin.username}</H1>
        <H1>Admin Password: ${admin.password}</H1>
    `);
})

app.post("/varify-admin",async(req,res)=>{
    const result = await sql`SELECT * FROM "Admin"`;
    const admin = result[0];
    console.log(req.body);
    const {username,password}=req.body;
    if(username===admin.username && password===admin.password){
        res.json({
            success:true,
            message:"Admin is varified succefully!"
        })
    }
    else{
        res.json({
            success:false,
            message:"Admin varification failed!"
        })
    }
})

app.listen(5000,()=>{
    console.log("Server is working!");
});




