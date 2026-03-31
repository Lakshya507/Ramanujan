import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, "db.json");

// Initialize mock DB if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    students: [
      { id: "1", name: "Aryan Singh", rollNo: "JEE101", category: "JEE", class: "12th", parentId: "p1", marks: { physics: 95, chemistry: 92, math: 98 } },
      { id: "2", name: "Isha Verma", rollNo: "NEET102", category: "NEET", class: "12th", parentId: "p2", marks: { physics: 88, chemistry: 95, biology: 94 } },
      { id: "3", name: "Rahul Kumar", rollNo: "B103", category: "Boards", class: "10th", parentId: "p3", marks: { math: 90, science: 85, english: 88 } },
    ],
    teachers: [
      { id: "t1", name: "Dr. R.K. Yadav", subject: "Physics (JEE/NEET)", experience: "15 years", image: "https://picsum.photos/seed/teacher1/200/200" },
      { id: "t2", name: "Prof. Sunita Rao", subject: "Mathematics (JEE/Boards)", experience: "12 years", image: "https://picsum.photos/seed/teacher2/200/200" },
    ],
    parents: [
      { id: "p1", name: "Suresh Singh", studentId: "1", password: "pass" },
      { id: "p2", name: "Meena Verma", studentId: "2", password: "pass" },
      { id: "p3", name: "Alok Kumar", studentId: "3", password: "pass" },
    ],
    topPerformers: [
      { id: "tp1", name: "Aryan Singh", score: "99.8 Percentile", category: "JEE Main", image: "https://picsum.photos/seed/student1/400/400" },
      { id: "tp2", name: "Isha Verma", score: "680/720", category: "NEET", image: "https://picsum.photos/seed/student2/400/400" },
    ],
    results: [
      { id: "r1", studentName: "Aryan Singh", score: "99.8%", rank: "AIR 150" },
      { id: "r2", studentName: "Isha Verma", score: "94.4%", rank: "AIR 1200" },
    ],
    quotes: [
      { id: "q1", text: "An equation for me has no meaning, unless it expresses a thought of God.", author: "Srinivasa Ramanujan" },
      { id: "q2", text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
    ],
    branches: [
      { id: "b1", name: "Ramanujan Classes - City Center", address: "Sector 15, Knowledge Park, New Delhi", phone: "+91 98765 43210" },
      { id: "b2", name: "Ramanujan Classes - South Campus", address: "Hauz Khas, Near Metro Station, New Delhi", phone: "+91 98765 43211" },
    ]
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

function getDB() {
  try {
    if (!fs.existsSync(DB_FILE)) return {};
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    return {
      students: data.students || [],
      teachers: data.teachers || [],
      parents: data.parents || [],
      topPerformers: data.topPerformers || [],
      results: data.results || [],
      quotes: data.quotes || [],
      branches: data.branches || []
    };
  } catch (error) {
    console.error("Error reading DB:", error);
    return {
      students: [],
      teachers: [],
      parents: [],
      topPerformers: [],
      results: [],
      quotes: [],
      branches: []
    };
  }
}

function saveDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/students", (req, res) => {
    res.json(getDB().students);
  });

  app.get("/api/teachers", (req, res) => {
    res.json(getDB().teachers);
  });

  app.get("/api/results", (req, res) => {
    res.json(getDB().results);
  });

  app.get("/api/quotes", (req, res) => {
    res.json(getDB().quotes);
  });

  app.get("/api/branches", (req, res) => {
    res.json(getDB().branches);
  });

  app.get("/api/top-performers", (req, res) => {
    res.json(getDB().topPerformers);
  });

  // Auth: Admin Login
  app.post("/api/auth/admin", (req, res) => {
    const { id, password } = req.body;
    if (id === "admin" && password === "admin123") {
      res.json({ success: true, role: "admin" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Auth: Student Login
  app.post("/api/auth/student", (req, res) => {
    const { rollNo } = req.body;
    const student = getDB().students.find((s: any) => s.rollNo === rollNo);
    if (student) {
      res.json({ success: true, student });
    } else {
      res.status(401).json({ error: "Invalid roll number" });
    }
  });

  // Auth: Parent Login
  app.post("/api/auth/parent", (req, res) => {
    const { parentId, password } = req.body;
    const parent = getDB().parents.find((p: any) => p.id === parentId && p.password === password);
    if (parent) {
      const student = getDB().students.find((s: any) => s.id === parent.studentId);
      res.json({ success: true, parent, student });
    } else {
      res.status(401).json({ error: "Invalid ID or password" });
    }
  });

  // Student Portal: Get marks by roll number
  app.get("/api/student/:rollNo", (req, res) => {
    const student = getDB().students.find((s: any) => s.rollNo === req.params.rollNo);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  });

  // Parent Portal: Get student performance by parent ID
  app.get("/api/parent/:parentId", (req, res) => {
    const parent = getDB().parents.find((p: any) => p.id === req.params.parentId);
    if (parent) {
      const student = getDB().students.find((s: any) => s.id === parent.studentId);
      res.json({ parent, student });
    } else {
      res.status(404).json({ error: "Parent not found" });
    }
  });

  // Admin: Manage Students
  app.post("/api/admin/students", (req, res) => {
    const db = getDB();
    const newStudent = { id: Date.now().toString(), ...req.body };
    db.students.push(newStudent);
    saveDB(db);
    res.json(newStudent);
  });

  // Admin: Manage Teachers
  app.post("/api/admin/teachers", (req, res) => {
    const db = getDB();
    const newTeacher = { id: Date.now().toString(), ...req.body };
    db.teachers.push(newTeacher);
    saveDB(db);
    res.json(newTeacher);
  });

  // Admin: Manage Top Performers
  app.post("/api/admin/top-performers", (req, res) => {
    const db = getDB();
    const newTP = { id: Date.now().toString(), ...req.body };
    db.topPerformers.push(newTP);
    saveDB(db);
    res.json(newTP);
  });

  app.delete("/api/admin/top-performers/:id", (req, res) => {
    const db = getDB();
    db.topPerformers = db.topPerformers.filter((tp: any) => tp.id !== req.params.id);
    saveDB(db);
    res.json({ success: true });
  });

  // Error handling middleware to ensure JSON responses
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        port: 3000,
        host: "0.0.0.0",
        hmr: false // Disable HMR as per instructions
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
