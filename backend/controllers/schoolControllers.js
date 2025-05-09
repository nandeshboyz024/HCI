import sql from '../db.js';

// GET Countries
export const getSchools = async (req, res) => {
  try {
    const {postalcodepk} = req.body;
    const result = await sql` SELECT "pk","SchoolName"
                              FROM "Schools"
                              WHERE "Postalcodepk"=${postalcodepk}
                              ORDER BY "SchoolName"
                              `;
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
      // console.log(pk);
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




export const getClasses = async (req, res) => {
  try {
    const {schoolpk} = req.body;
    const result = await sql`SELECT "Class" FROM "SchoolClasses" WHERE "Schoolpk"=${schoolpk};`;
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Error in fetching classes for a school: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getSections = async (req, res) => {
  try {
    const {schoolpk, className} = req.body;

    const result = await sql`SELECT "Sections" FROM "SchoolClasses" WHERE "Schoolpk"=${schoolpk} AND "Class"=${className};`;
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Error in fetching sections for a class: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const getStudentsForPrimaryScreening = async (req, res) => {
  try {
    const {schoolpk, className, section} = req.body;
    const result = await sql`SELECT
    s."StudentId",
    s."StudentName",
    s."ParentName",
    s."Age",
    s."Sex",
    p."reVision",
    p."leVision",
    p."testResultStatus",
    p.status
FROM
    "Students" s
JOIN
    "primaryScreeningData" p
ON
    s."StudentId" = p."satsId"
WHERE
    s."Schoolpk" = ${schoolpk}
    AND s."Class" = ${className}
    AND s."Section" = ${section};`;

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Error in fetching primary screening students for a class: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




export const primaryScreeningSubmitForm = async (req, res) => {
  try {
    const {satsId, reVision , leVision }  = req.body;

    // console.log("Received data: ", req.body);
    await sql`UPDATE "primaryScreeningData"
SET
    "reVision" = ${reVision},
    "leVision" = ${leVision},
    "status" = 1,
    "testResultStatus" = CASE
            WHEN (${reVision} IN ('6/6', '6/7.5') AND ${leVision} IN ('6/6', '6/7.5')) THEN 'Normal'
            ELSE 'Secondary Evaluation Required'
    END
WHERE
    "satsId" = ${satsId};`;

    const primaryResult = await sql`
    SELECT * FROM "primaryScreeningData" WHERE "satsId" = ${satsId};`;


    const testResultStatus = primaryResult[0].testResultStatus;
    // console.log(testResultStatus);

    // Check if secondary evaluation is required
    if (testResultStatus === 'Secondary Evaluation Required') {
      // Check if an entry already exists in the secondaryScreeningData table
      const existingSecondaryEntry = await sql`
        SELECT * FROM "secondaryScreeningData" WHERE "satsId" = ${satsId};
      `;

      if (existingSecondaryEntry.length > 0) {
        // Update the existing entry in the secondaryScreeningData table
        await sql`
         UPDATE "secondaryScreeningData"
SET
    "rightEyeVision" = ${reVision},
    "leftEyeVision" = ${leVision},
    "primaryTestResultStatus" = ${testResultStatus},
    "status" = 0,
    "rightEyeSPH" = null,
    "rightEyeCYL" = null,
    "rightEyeAXIS" = null,
    "leftEyeSPH" = null,
    "leftEyeCYL" = null,
    "leftEyeAXIS" = null,
    "mobileNumber" = null,
    "refractiveError" = null,
    "spectaclesFrameCode" = null
WHERE
    "satsId" = ${satsId};

        `;
      } else {
        // Insert a new entry into the secondaryScreeningData table
        await sql`
          INSERT INTO "secondaryScreeningData" (
              "satsId",
              "rightEyeVision",
              "leftEyeVision",
              "primaryTestResultStatus",
              "status"
          ) VALUES (
              ${satsId},
              ${reVision},
              ${leVision},
              ${testResultStatus},
              0
          );
        `;
      }
    }
    else if (testResultStatus === 'Normal') {
      // Remove the entry from the secondaryScreeningData table if it exists
      await sql`
        DELETE FROM "secondaryScreeningData"
        WHERE "satsId" = ${satsId};
      `;
    }



    // await sql`UPDATE "primaryScreeningData"
    // SET
        
    // WHERE
    //     "satsId" = ${satsId};`;
    


    const result = await sql`SELECT * FROM "Students" WHERE "StudentId" = ${satsId};`
    // const secondaryResult = await sql`SELECT * FROM "secondaryScreeningData" WHERE "/satsId" = ${satsId};`  

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    console.error("Error in submitting primary screening form: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const secondaryScreeningSubmitForm = async (req, res) => {
  try {
    const {
      satsId,
      rightEyeSPH,
      rightEyeCYL,
      rightEyeAXIS,
      rightEyeVision,
      leftEyeSPH,
      leftEyeCYL,
      leftEyeAXIS,
      leftEyeVision,
      mobileNumber,
      refractiveError,
      spectaclesFrameCode
    } = req.body;

    const normalVisions = ['6/6', '6/7.5'];
    const isNormal = normalVisions.includes(rightEyeVision) && normalVisions.includes(leftEyeVision);
    // console.log("Is normal vision: ", isNormal);
    
    if (isNormal) {
      // Update testResultStatus to 'Normal' in primaryScreeningData
      // console.log("Updating primaryScreeningData to Normal");

      await sql`
        UPDATE "primaryScreeningData"
        SET 
              "testResultStatus" = 'Normal',
              "reVision" = ${rightEyeVision},
              "leVision" = ${leftEyeVision}
        WHERE "satsId" = ${satsId};
      `;

      // Delete the entry from secondaryScreeningData if it exists
      await sql`
        DELETE FROM "secondaryScreeningData"
        WHERE "satsId" = ${satsId};
      `;

      return res.json({
        success: true,
        message: "Vision normal. Entry deleted from secondary screening and status updated.",
      });
    }

    // If not normal, update secondaryScreeningData
    await sql`
      UPDATE "secondaryScreeningData"
      SET
          "rightEyeSPH" = ${rightEyeSPH},
          "rightEyeCYL" = ${rightEyeCYL},
          "rightEyeAXIS" = ${rightEyeAXIS},
          "rightEyeVision" = ${rightEyeVision},
          "leftEyeSPH" = ${leftEyeSPH},
          "leftEyeCYL" = ${leftEyeCYL},
          "leftEyeAXIS" = ${leftEyeAXIS},
          "leftEyeVision" = ${leftEyeVision},
          "mobileNumber" = ${mobileNumber},
          "refractiveError" = ${refractiveError},
          "spectaclesFrameCode" = ${spectaclesFrameCode},
          "status" = 1
      WHERE
          "satsId" = ${satsId};
    `;

    await sql`
        UPDATE "primaryScreeningData"
        SET 
              "testResultStatus" = 'Secondary Evaluation Required',
              "reVision" = ${rightEyeVision},
              "leVision" = ${leftEyeVision}
        WHERE "satsId" = ${satsId};
      `;

    const result = await sql`
      SELECT * FROM "Students" WHERE "StudentId" = ${satsId};
    `;

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Error in submitting secondary screening form: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




export const getStudentsForSecondaryScreening = async (req, res) => {
  try {
    const {schoolpk, className, section} = req.body;

    const result = await sql`SELECT
    s."StudentId",
    s."StudentName",
    s."ParentName",
    s."Age",
    s."Sex",

    p."rightEyeVision",
    p."rightEyeSPH",
    p."rightEyeCYL",
    p."rightEyeAXIS",

    p."leftEyeVision",
    p."leftEyeSPH",
    p."leftEyeCYL",
    p."leftEyeAXIS",
    
    p."primaryTestResultStatus",
    p.status,
    p."mobileNumber",
    p."refractiveError",
    p."spectaclesFrameCode"
    
FROM
    "Students" s
JOIN
    "secondaryScreeningData" p
ON
    s."StudentId" = p."satsId"
WHERE
    s."Schoolpk" = ${schoolpk}
    AND s."Class" = ${className}
    AND s."Section" = ${section};`;
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("Error in fetching secondary screening students for a class: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const primaryTestedCountStudentsBySchool = async (req, res) => {
  try {
    const { schoolpk } = req.body;

    if (!schoolpk) {
      return res.status(400).json({
        success: false,
        message: "Schoolpk is required"
      });
    }
 
    const result = await sql`
      SELECT COUNT(*) AS studentCount
      FROM "Students" s
      JOIN "primaryScreeningData" psd ON s."StudentId" = psd."satsId"
      WHERE s."Schoolpk" = ${schoolpk} AND psd."status" = 1;
    `;

    res.json({
      success: true,
      data: result[0].studentcount
    });
  } catch (err) {
    console.error("Error in counting students by school: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const getTotalStudentsBySchool = async (req, res) => {
  try {
    const { schoolpk } = req.body;

    if (!schoolpk) {
      return res.status(400).json({
        success: false,
        message: "Schoolpk is required"
      });
    }

    const result = await sql`
      SELECT COUNT(*) AS TotalStudents
      FROM "Students"
      WHERE "Schoolpk" = ${schoolpk};
    `;

    res.json({
      success: true,
      data: result[0].totalstudents
    });
  } catch (err) {
    console.error("Error in counting students by school: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const getSecondaryTestedCountStudentsBySchool = async (req, res) => {
  try {
    const { schoolpk } = req.body;

    if (!schoolpk) {
      return res.status(400).json({
        success: false,
        message: "Schoolpk is required"
      });
    }

    const result = await sql`
      SELECT COUNT(*) AS studentCount
      FROM "Students" s
      JOIN "secondaryScreeningData" ssd ON s."StudentId" = ssd."satsId"
      WHERE s."Schoolpk" = ${schoolpk} AND ssd."status" = 1;
    `;

    res.json({
      success: true,
      data: result[0].studentcount
    });
  } catch (err) {
    console.error("Error in counting students by school: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};



