require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(express.json());

// Data dosyası yolu
const dataPath = path.join(__dirname, "data", "prompts.json");

// Yardımcı fonksiyonlar - JSON okuma/yazma
const readData = () => {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// ===================
// API ROUTES
// ===================

// GET - Tüm promptları getir
app.get("/api/prompts", (req, res) => {
  try {
    const prompts = readData();
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: "Veriler okunamadı" });
  }
});

// GET - Tek prompt getir
app.get("/api/prompts/:id", (req, res) => {
  try {
    const prompts = readData();
    const prompt = prompts.find((p) => p.id === req.params.id);

    if (!prompt) {
      return res.status(404).json({ error: "Prompt bulunamadı" });
    }

    res.json(prompt);
  } catch (error) {
    res.status(500).json({ error: "Veri okunamadı" });
  }
});

// POST - Yeni prompt ekle
app.post("/api/prompts", (req, res) => {
  try {
    const { title, image, description, prompt } = req.body;

    // Basit validasyon
    if (!title || !prompt) {
      return res.status(400).json({ error: "Başlık ve prompt zorunlu" });
    }

    const prompts = readData();

    const newPrompt = {
      id: uuidv4(),
      title,
      image: image || "",
      description: description || "",
      prompt,
      createdAt: new Date().toISOString(),
    };

    prompts.push(newPrompt);
    writeData(prompts);

    res.status(201).json(newPrompt);
  } catch (error) {
    res.status(500).json({ error: "Prompt eklenemedi" });
  }
});

// PUT - Prompt güncelle
app.put("/api/prompts/:id", (req, res) => {
  try {
    const { title, image, description, prompt } = req.body;

    // Basit validasyon
    if (!title || !prompt) {
      return res.status(400).json({ error: "Başlık ve prompt zorunlu" });
    }

    let prompts = readData();
    const index = prompts.findIndex((p) => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Prompt bulunamadı" });
    }

    // Mevcut veriyi güncelle
    prompts[index] = {
      ...prompts[index],
      title,
      image: image || "",
      description: description || "",
      prompt,
      updatedAt: new Date().toISOString(),
    };

    writeData(prompts);

    res.json(prompts[index]);
  } catch (error) {
    res.status(500).json({ error: "Prompt güncellenemedi" });
  }
});

// DELETE - Prompt sil
app.delete("/api/prompts/:id", (req, res) => {
  try {
    let prompts = readData();
    const index = prompts.findIndex((p) => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Prompt bulunamadı" });
    }

    prompts.splice(index, 1);
    writeData(prompts);

    res.json({ message: "Prompt silindi" });
  } catch (error) {
    res.status(500).json({ error: "Prompt silinemedi" });
  }
});

// ===================
// AUTH
// ===================

// Admin bilgileri .env'den alınıyor
const ADMIN_USER = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

const AUTH_TOKEN = process.env.AUTH_TOKEN || "simple-secret-token-12345";

// Login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    res.json({ success: true, token: AUTH_TOKEN });
  } else {
    res
      .status(401)
      .json({ success: false, error: "Geçersiz kullanıcı adı veya şifre" });
  }
});

// Auth middleware (korumalı route'lar için)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (token === AUTH_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: "Yetkisiz erişim" });
  }
};

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`✅ Server çalışıyor: http://localhost:${PORT}`);
});

// Vercel için export
module.exports = app;
