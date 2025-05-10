import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify';
import sql from '../db.js';  

export const uploadStudents = async (req, res) => {
  try {
    // console.log('File:', req.file);
    // console.log('School PK: ', req.body.schoolpk);

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const schoolpk = parseInt(req.body.schoolpk);
    if (isNaN(schoolpk)) {
      return res.status(400).json({ message: 'Invalid schoolpk' });
    }

    // Parse CSV
    const csvString = req.file.buffer.toString().replace(/^\uFEFF/, '');

    const records = parse(csvString, {
      columns: true,
      skip_empty_lines: true
    });

    const expectedColumns = [
      'StudentId',
      'StudentName',
      'ParentName',
      'Age',
      'Sex',
      'Class',
      'Section'
    ];
    if (records.length === 0) {
      return res.status(400).json({ success:false,message: 'CSV file is empty' });
    }
    const actualColumns = Object.keys(records[0]);
    if (
      actualColumns.length !== expectedColumns.length ||
      !expectedColumns.every((col, idx) => col === actualColumns[idx])
    ) {
      return res.status(400).json({
        success: false,
        message: 'CSV columns do not match the expected order or names',
        expected: expectedColumns.join(', '),
        actual: actualColumns.join(', ')
      });      
    }

    let skipped = 0;
    let nonSkipped = 0;
    const initialCountResult = await sql`SELECT COUNT(*) FROM "Students" WHERE "Schoolpk"=${schoolpk}`;
    const initialCount = parseInt(initialCountResult[0].count);
    // Process each record
    for (const row of records) {
      let { StudentId, StudentName, ParentName, Age, Sex, Class: classId, Section} = row;
      StudentId = StudentId?.trim();
      Section = Section?.trim();
      ParentName=ParentName?.trim();
      StudentName = StudentName?.trim();
      Age=Age?.trim();
      classId=classId?.trim();
      if(Section===null || Section==="") Section="Others";
      if(!StudentId || StudentId==="") {
        skipped++;
        continue;
      }
      if(!StudentName || StudentName==="") {
        skipped++;
        continue;
      }
      if(!ParentName || ParentName==="") {
        skipped++;
        continue;
      }
      const parsedAge = parseInt(Age);
      if(isNaN(parsedAge)) {
        skipped++;
        continue;
      }
      const parsedClass = parseInt(classId);
      if(isNaN(parsedClass)) {
        skipped++;
        continue;
      }
      nonSkipped++;
      // 1. UPSERT into "Students"
      await sql`
        INSERT INTO "Students" 
        ("StudentId", "StudentName", "ParentName", "Age", "Sex", "Class", "Section", "Schoolpk")
        VALUES (${StudentId}, ${StudentName}, ${ParentName}, ${parseInt(Age)}, ${Sex}, ${parseInt(classId)}, ${Section}, ${schoolpk})
        ON CONFLICT ("StudentId")
        DO UPDATE SET
          "StudentName" = EXCLUDED."StudentName",
          "ParentName" = EXCLUDED."ParentName",
          "Age" = EXCLUDED."Age",
          "Sex" = EXCLUDED."Sex",
          "Class" = EXCLUDED."Class",
          "Section" = EXCLUDED."Section",
          "Schoolpk" = EXCLUDED."Schoolpk";
      `;

      // 2. UPSERT into "SchoolClasses" and append section if not exists
      await sql`
        INSERT INTO "SchoolClasses" ("Schoolpk", "Class", "Sections")
        VALUES (${schoolpk}, ${parseInt(classId)}, ARRAY[${Section}])
        ON CONFLICT ("Schoolpk", "Class")
        DO UPDATE SET
          "Sections" = (
            CASE
              WHEN NOT (${Section} = ANY("SchoolClasses"."Sections"))
              THEN array_append("SchoolClasses"."Sections", ${Section})
              ELSE "SchoolClasses"."Sections"
            END
          );
      `;
      // 3. Insert into "primaryScreeningData"
      await sql`
        INSERT INTO "primaryScreeningData"
        ("satsId", "reVision", "leVision", "status", "testResultStatus")
        VALUES (${StudentId}, '6/6', '6/6', 0, NULL)
        ON CONFLICT ("satsId") DO NOTHING;
      `;
      
    }
    const finalCountResult = await sql`SELECT COUNT(*) FROM "Students" WHERE "Schoolpk"=${schoolpk}`;
    const finalCount = parseInt(finalCountResult[0].count);

    const newStudentsAdded = finalCount - initialCount;
    const updatedStudents = nonSkipped-newStudentsAdded;
    return res.status(200).json({
      success:true,
      message: 'Data uploaded successfully',
      newAddedRecords: newStudentsAdded,
      updatedRecords: updatedStudents,
      totalRecords: finalCount,
      skippedRecords:skipped
    });

  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ success:false, message: 'Upload failed!', error: err.message });
  }
};

export const getTotalStudents = async (req, res) =>{
  try{
    const {schoolpk} = req.body;
    const result1 = await sql`SELECT Count(*) AS "StudentCount" FROM "Students" WHERE "Schoolpk"=${schoolpk}`;
    const result2 = await sql`SELECT COUNT(*) AS "StudentCount" FROM "Students" s JOIN "primaryScreeningData" psd ON s."StudentId" = psd."satsId" WHERE s."Schoolpk" = ${schoolpk} AND psd."status" = 1;`;
    const result3 = await sql`SELECT COUNT(*) AS "StudentCount" FROM "Students" s JOIN "secondaryScreeningData" ssd ON s."StudentId" = ssd."satsId" WHERE s."Schoolpk" = ${schoolpk} AND ssd."status" = 1;`;
    res.json({
      success: true,
      data1: result1[0],
      data2: result2[0],
      data3: result3[0]
    });
  }catch(err){
    console.log(err);
    return res.status(500).json({ message: 'Failed to fetch Total Students', error: err.message });
  }
}



export const downloadStudents = async (req, res) => {
  try {
    const { schoolpk } = req.body;
    // console.log(schoolpk);

    const students = await sql`
      SELECT "StudentId", "StudentName", "ParentName", "Age", "Sex", "Class", "Section"
      FROM "Students"
      WHERE "Schoolpk" = ${schoolpk}
    `;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=students_${schoolpk}.csv`);
    stringify(students, { header: true }).pipe(res);
  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).json({ message: 'Failed to download CSV', error: err.message });
  }
};
