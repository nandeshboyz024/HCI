// controllers/adminController.js
import sql from '../db.js';

export const showAdmin = async (req, res) => {
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
};

export const verifyAdmin = async (req, res) => {
  try {
    const result = await sql`SELECT * FROM "Admin"`;
    const admin = result[0];
    const { username, password } = req.body;

    if (username === admin.username && password === admin.password) {
      res.json({
        success: true,
        message: "Admin is verified successfully!",
      });
    } else {
      res.json({
        success: false,
        message: "Admin verification failed!",
      });
    }
  } catch (error) {
    console.error("Error verifying admin:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const changeAdminPassword = async(req, res)=>{
    try {
        const { username, currentPassword, newPassword } = req.body;

        const result = await sql`SELECT * FROM "Admin"`;
        const admin = result[0];

        if (username === admin.username && currentPassword === admin.password) {
            await sql`UPDATE "Admin" SET password = ${newPassword} WHERE username = ${username}`;
            res.json({
                success: true,
                message: "Password updated successfully."
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid username or current password."
            });
        }
    } catch (error) {
        console.error("Error changing admin password:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
