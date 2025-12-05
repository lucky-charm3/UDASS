const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
const Student = require("./models/studentModel.js");

dotenv.config();

// Sample student data
const students = [
  {
    fullName: "Fatma Mussa",
    email: "admin@udass.udom.ac.tz",
    phone: "+255712345678",
    regNumber: "T24-01-00001",
    password: "admin123",
    role: "admin",
    isMembershipActive: true,
    membershipExpiry: new Date("2026-04-01"),
    paymentHistory: [
      {
        amount: 2000,
        method: "M-Pesa",
        reference: "TEST123456",
        paidAt: new Date("2025-04-01"),
        status: "completed"
      },
    ],
  },
  {
    fullName: "Aisha Juma",
    email: "aisha@udom.ac.tz",
    phone: "+255768123456",
    regNumber: "T24-03-16678",
    password: "aisha123",
    role: "student",
    isMembershipActive: true,
    membershipExpiry: new Date("2026-06-15"),
    paymentHistory: [
      {
        amount: 2000,
        method: "M-Pesa",
        reference: "MPESA20250615",
        paidAt: new Date("2025-06-15"),
        status: "completed"
      },
    ],
  },
  {
    fullName: "Zainabu Hassan",
    email: "zainabu@udom.ac.tz",
    phone: "+255779987654",
    regNumber: "T25-02-17890",
    password: "zainabu123",
    role: "student",
    isMembershipActive: false,
    membershipExpiry: null,
    paymentHistory: [],
  },
  {
    fullName: "Mariam Ally",
    email: "mariam@udom.ac.tz",
    phone: "+255659112233",
    regNumber: "E24-04-15432",
    password: "mariam123",
    role: "student",
    isMembershipActive: true,
    membershipExpiry: new Date("2026-03-20"),
    paymentHistory: [
      {
        amount: 2000,
        method: "Tigo Pesa",
        reference: "TIGO20250320",
        paidAt: new Date("2025-03-20"),
        status: "completed"
      },
    ],
  },
];

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.bold);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`.red);
    process.exit(1);
  }
};

// Seed database with sample data
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...".yellow);
    
    // Connect to database
    await connectDB();
    
    // Clear existing students
    const deleteResult = await Student.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing students`.yellow);
    
    // Insert new students
    const createdStudents = await Student.create(students);
    console.log(`✅ Successfully seeded ${createdStudents.length} students:`.green.bold);
    
    // Display created students
    createdStudents.forEach((student, index) => {
      console.log(`   ${index + 1}. ${student.fullName} (${student.regNumber}) - ${student.role}`);
    });
    
    // Display admin credentials
    const admin = createdStudents.find(s => s.role === 'admin');
    if (admin) {
      console.log("\n🔑 Admin Login Credentials:".cyan.bold);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${students.find(s => s.role === 'admin').password}`);
      console.log(`   Reg Number: ${admin.regNumber}`);
    }
    
    // Display summary
    const activeCount = createdStudents.filter(s => s.isMembershipActive).length;
    console.log(`\n📊 Summary: ${activeCount} active members, ${createdStudents.length - activeCount} inactive`.magenta);
    
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`.red);
    console.error(error.stack);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB".gray);
    process.exit(0);
  }
};

// Destroy all data
const destroyData = async () => {
  try {
    console.log("⚠️  Starting data destruction...".red.bold);
    
    // Connect to database
    await connectDB();
    
    // Confirm action
    if (process.argv[3] !== '--force') {
      console.log("\n⚠️  WARNING: This will delete ALL student data!");
      console.log("   To proceed, run: node seed.js -d --force");
      await mongoose.disconnect();
      process.exit(0);
    }
    
    // Delete all students
    const result = await Student.deleteMany({});
    console.log(`🗑️  Successfully deleted ${result.deletedCount} student records`.red);
    
  } catch (error) {
    console.error(`❌ Destruction failed: ${error.message}`.red);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB".gray);
    process.exit(0);
  }
};

// Show help
const showHelp = () => {
  console.log(`
📚 Database Seeding Script
Usage: node seed.js [OPTION]

Options:
  (no option)    Seed database with sample data
  -d, --destroy  Delete all student data (requires --force)
  -h, --help     Show this help message

Examples:
  node seed.js                    # Seed database
  node seed.js -d --force         # Delete all data
  node seed.js --help             # Show help
  `.cyan);
};

// Command line argument handling
const main = async () => {
  const args = process.argv.slice(2);
  
  if (args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
  }
  
  if (args.includes('-d') || args.includes('--destroy')) {
    await destroyData();
  } else {
    await seedDatabase();
  }
};

// Add error handling for unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled rejection: ${err.message}`.red);
  console.error(err.stack);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}