require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Prompt = require("./models/Prompt");

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Bağlantısı
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB bağlantısı başarılı"))
  .catch((err) => console.error("❌ MongoDB bağlantı hatası:", err));

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(express.json());

// ===================
// API ROUTES
// ===================

// GET - Tüm promptları getir
app.get("/api/prompts", async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 });
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: "Veriler okunamadı" });
  }
});

// GET - Tek prompt getir
app.get("/api/prompts/:id", async (req, res) => {
  try {
    const prompt = await Prompt.findOne({ id: req.params.id });

    if (!prompt) {
      return res.status(404).json({ error: "Prompt bulunamadı" });
    }

    res.json(prompt);
  } catch (error) {
    res.status(500).json({ error: "Veri okunamadı" });
  }
});

// POST - Yeni prompt ekle
app.post("/api/prompts", async (req, res) => {
  try {
    const { title, image, description, prompt } = req.body;

    // Basit validasyon
    if (!title || !prompt) {
      return res.status(400).json({ error: "Başlık ve prompt zorunlu" });
    }

    const newPrompt = new Prompt({
      id: uuidv4(),
      title,
      image: image || "",
      description: description || "",
      prompt,
      createdAt: new Date(),
    });

    await newPrompt.save();
    res.status(201).json(newPrompt);
  } catch (error) {
    res.status(500).json({ error: "Prompt eklenemedi" });
  }
});

// PUT - Prompt güncelle
app.put("/api/prompts/:id", async (req, res) => {
  try {
    const { title, image, description, prompt } = req.body;

    // Basit validasyon
    if (!title || !prompt) {
      return res.status(400).json({ error: "Başlık ve prompt zorunlu" });
    }

    const updatedPrompt = await Prompt.findOneAndUpdate(
      { id: req.params.id },
      {
        title,
        image: image || "",
        description: description || "",
        prompt,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedPrompt) {
      return res.status(404).json({ error: "Prompt bulunamadı" });
    }

    res.json(updatedPrompt);
  } catch (error) {
    res.status(500).json({ error: "Prompt güncellenemedi" });
  }
});

// DELETE - Prompt sil
app.delete("/api/prompts/:id", async (req, res) => {
  try {
    const deletedPrompt = await Prompt.findOneAndDelete({ id: req.params.id });

    if (!deletedPrompt) {
      return res.status(404).json({ error: "Prompt bulunamadı" });
    }

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
