const mysql = require("mysql2/promise");

const connectDB = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// connect to database
(async () => {
  try {
    const connection = await connectDB.getConnection();
    console.log("Database Connected");
    connection.release();
  } catch (error) {
    console.log("error in connecting database", error);
  }
})();
module.exports = connectDB;
