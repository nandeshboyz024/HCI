import sql from '../db.js';

// GET Countries
export const getCountries = async (req, res) => {
  try {
    const result = await sql`SELECT DISTINCT "Country" FROM "Postalcodes"`;
    const countries = result.map(row => row.Country).filter(Boolean);
    res.json({
      success: true,
      data: countries,
    });

  } catch (err) {
    console.error("Error fetching countries:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// GET States for a country
export const getStates = async (req, res) => {
  try {
    const { Country } = req.body;
    const result = await sql`
      SELECT DISTINCT "State"
      FROM "Postalcodes"
      WHERE "Country" = ${Country}
      ORDER BY "State"
    `;
    const states = result.map(row => row.State).filter(Boolean);
    
    res.json({
      success: true,
      data: states,
    });
  } catch (err) {
    console.error("Error fetching states:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// GET Districts for a country and state
export const getDistricts = async (req, res) => {
  try {
    const { Country, State } = req.body;
    const result = await sql`
      SELECT DISTINCT "District"
      FROM "Postalcodes"
      WHERE "Country" = ${Country} AND "State" = ${State}
      ORDER BY "District"
    `;
    const districts = result.map(row => row.District).filter(Boolean);
    res.json({
      success: true,
      data: districts
    });
  } catch (err) {
    console.error("Error fetching districts:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// GET Taluks for a country, state, and district
export const getTaluks = async (req, res) => {
  try {
    const { Country, State, District } = req.body;
    const result = await sql`
      SELECT DISTINCT "Taluk","pk","Postalcode"
      FROM "Postalcodes"
      WHERE "Country" = ${Country}
        AND "State" = ${State}
        AND "District" = ${District}
      ORDER BY "Taluk"
    `;
    const taluks = result.map(row => [row.Taluk,row.pk,row.Postalcode]).filter(Boolean);

    res.json({
      success: true,
      data: taluks
    });
  } catch (err) {
    console.error("Error fetching taluks:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
