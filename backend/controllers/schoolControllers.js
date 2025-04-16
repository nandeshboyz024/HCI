import sql from '../db.js';

// GET Countries
export const getSchools = async (req, res) => {
  try {
    const {postalcodepk} = req.body;
    const result = await sql`SELECT "pk","SchoolName" FROM "Schools" WHERE "Postalcodepk"=${postalcodepk};`;
    const schools = result.map(row => [row.pk,row.SchoolName]).filter(Boolean);
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
      const {schoolpk} = req.body;
      const result = await sql`SELECT "HMName", "HMCN", "SchoolCode", "SchoolEmail" FROM "Schools" WHERE "pk"=${schoolpk};`;
      res.json({
        success: true,
        data: result[0],
      });
    } catch (err) {
      console.error("Error fetching schools:", err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
