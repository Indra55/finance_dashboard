import { pool } from "../config/dbConfig.ts";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Seeding database...");
  try {
    const saltRounds = 10;
    
    // Hash passwords for the mock users
    const adminPass = await bcrypt.hash("admin123", saltRounds);
    const analystPass = await bcrypt.hash("analyst123", saltRounds);
    const viewerPass = await bcrypt.hash("viewer123", saltRounds);

    // Clear existing data (optional but recommended for a clean seed)
    await pool.query("TRUNCATE financial_records, users CASCADE;");

    // Insert mock users
    const usersRes = await pool.query(`
      INSERT INTO users (name, email, password_hash, role, status) VALUES
      ('Admin User', 'admin@example.com', $1, 'admin', 'active'),
      ('Analyst User', 'analyst@example.com', $2, 'analyst', 'active'),
      ('Viewer User', 'viewer@example.com', $3, 'viewer', 'active')
      RETURNING id, role;
    `, [adminPass, analystPass, viewerPass]);

    const users = usersRes.rows;

    const adminId = users.find(u => u.role === 'admin').id;
    const analystId = users.find(u => u.role === 'analyst').id;

    // Insert mock financial records
    await pool.query(`
      INSERT INTO financial_records (user_id, amount, type, category, description, date) VALUES
      ($1, 1500.00, 'income', 'Salary', 'Monthly salary', CURRENT_DATE - INTERVAL '60 days'),
      ($1, 50.00, 'expense', 'Food', 'Groceries', CURRENT_DATE - INTERVAL '45 days'),
      ($1, 100.00, 'expense', 'Utilities', 'Electric bill', CURRENT_DATE - INTERVAL '30 days'),
      ($2, 3000.00, 'income', 'Freelance', 'Project payment', CURRENT_DATE - INTERVAL '15 days'),
      ($2, 20.00, 'expense', 'Transport', 'Bus pass', CURRENT_DATE - INTERVAL '5 days');
    `, [adminId, analystId]);

    console.log("✅ Database seeded successfully with mock data!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

seed();
