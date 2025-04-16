import sql from '../db.js';

// GET Countries
export const getSchools = async (req, res) => {
  try {
    const {postalcodepk} = req.body;
    const result = await sql`SELECT "SchoolCode","SchoolName" FROM "Schools" WHERE "Postalcodepk"=${postalcodepk};`;
    const schools = result.map(row => [row.SchoolCode,row.SchoolName]).filter(Boolean);
    res.json({
      success: true,
      data: schools,
    });
  } catch (err) {
    console.error("Error fetching schools:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSchool = async (req, res) => {
    try {
      const {SchoolCode} = req.body;
      const result = await sql`SELECT "SchoolCode","SchoolName" FROM "Schools" WHERE "Postalcodepk"=${postalcodepk};`;
      const schools = result.map(row => [row.SchoolCode,row.SchoolName]).filter(Boolean);
      res.json({
        success: true,
        data: schools,
      });
    } catch (err) {
      console.error("Error fetching schools:", err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };