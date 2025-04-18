import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify';
import sql from '../db.js';  

export const uploadStudents = async (req, res) => {
  try {
    console.log('File:', req.file);
    console.log('School PK: ', req.body.schoolpk);

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
      return res.status(400).json({ message: 'CSV file is empty' });
    }
    const actualColumns = Object.keys(records[0]);
    if (
      actualColumns.length !== expectedColumns.length ||
      !expectedColumns.every((col, idx) => col === actualColumns[idx])
    ) {
      return res.status(400).json({
        message: 'CSV columns do not match the expected order or names',
        expected: expectedColumns,
        actual: actualColumns
      });
    }

    // Process each record
    for (const row of records) {
      const { StudentId, StudentName, ParentName, Age, Sex, Class: classId, Section} = row;
      
      if(!StudentId) continue;
      if(!StudentName) continue;
      if(!ParentName) continue;
      const parsedAge = parseInt(Age);
      if(isNaN(parsedAge)) continue;
      const parsedClass = parseInt(classId);
      if(isNaN(parsedClass)) continue;
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
      // console.log("added");
    }

    return res.status(200).json({
      success:true,
      message: 'Data uploaded successfully',
      totalRecords: records.length
    });

  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ message: 'Upload failed!', error: err.message });
  }
};

export const getTotalStudents = async (req, res) =>{
  try{
    const {schoolpk} = req.body;
    const result = await sql`SELECT Count(*) AS "TotalStudents" FROM "Students" WHERE "Schoolpk"=${schoolpk}`;
    res.json({
      success: true,
      data: result[0],
    });
  }catch(err){
    console.log(err);
    return res.status(500).json({ message: 'Failed to fetch Total Students', error: err.message });
  }
}



export const downloadStudents = async (req, res) => {
  try {
    const { schoolpk } = req.body;

    const students = await sql`
      SELECT "StudentId", "StudentName", "ParentName", "Age", "Sex", "Class", "Section"
      FROM "Students"
      WHERE "Schoolpk" = ${schoolpk}
    `;

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found.' });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=students_${schoolpk}.csv`);

    stringify(students, { header: true }).pipe(res);

  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).json({ message: 'Failed to download CSV', error: err.message });
  }
};
