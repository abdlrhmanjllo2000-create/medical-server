const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🟢 اتصال قاعدة البيانات (Railway)
const db = mysql.createConnection({
  host: "roundhouse.proxy.rlwy.net",
  user: "root",
  password: "FbLSDScbwhwEocaKuPkVVVCEPHACONT",
  database: "railway",
  port: 38921
});

// 🔌 فحص الاتصال
db.connect(err => {
  if (err) {
    console.log("Database error:", err);
  } else {
    console.log("Connected to DB");
  }
});

// 📋 جلب المرضى
app.get("/patients", (req, res) => {
  db.query("SELECT * FROM patients", (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

// ➕ إضافة مريض
app.post("/add-patient", (req, res) => {
  const { name, age } = req.body;

  db.query(
    "INSERT INTO patients (name, age) VALUES (?, ?)",
    [name, age],
    (err) => {
      if (err) return res.json(err);
      res.json("تم الحفظ");
    }
  );
});

// ❌ حذف مريض
app.delete("/delete-patient/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM patients WHERE id = ?", [id], (err) => {
    if (err) return res.json(err);
    res.json("تم الحذف");
  });
});

// ✏️ تعديل مريض
app.put("/update-patient/:id", (req, res) => {
  const id = req.params.id;
  const { name, age } = req.body;

  db.query(
    "UPDATE patients SET name=?, age=? WHERE id=?",
    [name, age, id],
    (err) => {
      if (err) return res.json(err);
      res.json("تم التعديل");
    }
  );
});

// 🚀 تشغيل السيرفر
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
