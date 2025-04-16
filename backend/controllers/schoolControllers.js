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
      const result = await sql`SELECT "HMName", "HMCN", "SchoolCode", "SchoolEmail","Distance" FROM "Schools" WHERE "pk"=${schoolpk};`;
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


export const addSchool = async (req, res) => {
  try {
    const {schoolCode,schoolName,HMName,HMCN,distance,postalcodepk,schoolEmail} = req.body;
    const existing = await sql`
      SELECT 1 FROM "Schools" WHERE "SchoolCode" = ${schoolCode} LIMIT 1;
    `;

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "School Code already exists.",
      });
    }

    const result = await sql`
      INSERT INTO "Schools" 
      ("SchoolCode", "SchoolName", "HMName", "HMCN", "Distance", "Postalcodepk", "SchoolEmail")
      VALUES (${schoolCode}, ${schoolName}, ${HMName}, ${HMCN}, ${distance}, ${postalcodepk}, ${schoolEmail})
      RETURNING "pk";
    `;
      const pk = result[0]?.pk;
      console.log(pk);
      res.status(200).json({
      success: true,
      message: "School added successfully",
      schoolpk:pk
      });
    } catch (err) {
    console.log('Error in inserting school: ',err)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateSchool = async (req, res) => {
  try {
    const {schoolCode, schoolName, HMName, HMCN, distance, schoolpk, schoolEmail} = req.body;

    const existing = await sql`
      SELECT 1 FROM "Schools" 
      WHERE "SchoolCode" = ${schoolCode} 
        AND "pk" != ${schoolpk}
      LIMIT 1;
    `;

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "School Code already exists for another school.",
      });
    }
    // Proceed with the update
    const result = await sql`
      UPDATE "Schools"
      SET 
        "SchoolCode" = ${schoolCode},
        "SchoolName" = ${schoolName},
        "HMName" = ${HMName},
        "HMCN" = ${HMCN},
        "Distance" = ${distance},
        "SchoolEmail" = ${schoolEmail}
      WHERE "pk" = ${schoolpk}
      RETURNING *;
    `;

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "School updated successfully"
    });
  } catch (err) {
    console.error("Error updating school:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



