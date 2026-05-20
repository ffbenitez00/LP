import { Router } from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//definimos los endpoints de la API
const router = Router();
const usersPath = path.join(process.cwd(), "data", "users.json");
function loadUsers() {
  if (!fs.existsSync(usersPath)) return [];
  return JSON.parse(fs.readFileSync(usersPath, "utf-8"));
}

function saveUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = loadUsers();

    // buscar usuario
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(400).json({
        error: "Usuario no encontrado"
      });
    }

    // comparar password
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        error: "Contraseña incorrecta"
      });
    }

    // generar token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,

      token,

      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        inventory: user.inventory,
      }
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Error del servidor"
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const users = loadUsers();

    // verificar email existente
    const exists = users.find(u => u.email === email);

    if (exists) {
      return res.status(400).json({
        error: "El usuario ya existe"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,

      inventory: {
        crates: [],
        skins: [],
      }
    };

    users.push(newUser);

    saveUsers(users);

    res.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      }
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Error del servidor"
    });
  }
});

// PATHS
const skinsPath = path.join(process.cwd(), "data", "skins.json");
const cratesPath = path.join(process.cwd(), "data", "crates.json");

// LOADERS
function loadSkins() {
  return JSON.parse(fs.readFileSync(skinsPath, "utf-8"));
}

function loadCrates() {
  return JSON.parse(fs.readFileSync(cratesPath, "utf-8"));
}


//IMG PARA EL CAMBIO DE FONDO (JSON CON RUTAS)
router.get("/backgrounds", (req, res) => {
  res.json({
    data: [
      "/img/background/dust2_back_plat_s2.png",
      "/img/background/dust2_blue_s2.png",
      "/img/background/dust2_double_doors_s2.png",
      "/img/background/nuke_ramp_s2.jpg",
      "/img/background/overpass_van_vista_s2.jpg",
      "/img/background/nuke_t_s2.jpg",
    ],
  });
});

// SKINS API
router.get("/skins", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;

  const skins = loadSkins();

  const start = (page - 1) * limit;
  const end = start + limit;

  res.json({
    page,
    totalPages: Math.ceil(skins.length / limit),
    data: skins.slice(start, end),
  });
});

router.get("/skin-img/:id", (req, res) => {
  const filePath = path.join(
    process.cwd(),
    "img",
    "skin",
    `${req.params.id}.png`
  );

  res.sendFile(filePath, err => {
    if (err) res.status(404).json({ error: "Imagen no encontrada" });
  });
});

router.get("/crates/:id", (req, res) => {
  const crates = loadCrates();

  const crate = crates.find(c => c.id === req.params.id);

  if (!crate) {
    return res.status(404).json({ error: "Crate no encontrada" });
  }

  res.json(crate);
});

router.get("/crates/:id/skins", (req, res) => {
  const crates = loadCrates();
  const skins = loadSkins();

  const crate = crates.find(c => c.id === req.params.id);

  if (!crate) {
    return res.status(404).json({ error: "Crate no encontrada" });
  }

  const result = skins.filter((skin) =>
    crate.contains.some((c) => c.id === skin.id)
  );

  const rare = crate.contains_rare
    ? skins.filter((skin) =>
        crate.contains_rare.some((c) => c.id === skin.id)
      )
    : [];

  res.json({
    normal: result,
    rare,
  });
});

// CRATES API
router.get("/crates", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;

  const crates = loadCrates(); //

  const start = (page - 1) * limit;
  const end = start + limit;

  res.json({
    page,
    totalPages: Math.ceil(crates.length / limit),
    data: crates.slice(start, end),
  });
});

router.get("/crates-img/:id", (req, res) => {
  const filePath = path.join(
    process.cwd(),
    "img",
    "crate",
    `${req.params.id}.png`
  );

  res.sendFile(filePath, err => {
    if (err) res.status(404).json({ error: "Imagen de caja no encontrada" });
  });
  router.post("/users/inventory/crates", (req, res) => {
      const { userId, crateId } = req.body;

      const users = loadUsers();

      const user = users.find(u => u.id === userId);

      if (!user) {
        return res.status(404).json({
          error: "Usuario no encontrado"
        });
      }

      if (!user.inventory) {
        user.inventory = {
          crates: [],
          skins: [],
        };
      }

      const existente = user.inventory.crates.find(
        c => c.id === crateId
      );

      if (existente) {
        existente.quantity += 1;
      } else {
        user.inventory.crates.push({
          id: crateId,
          quantity: 1,
        });
      }

      saveUsers(users);

      res.json({
        success: true
      });
    });
});
export default router;
/*import express from "express"
import path from "path";
import url from "url";
import fs from "fs";
import bcrypt from 'bcryptjs';
import { loadJson , saveJson } from "../utils/jsonUtils.js";

const api = express.Router()
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas que lee los JSON y los envía al cliente
api.get("/skins", async (req, res) => {
  const jsonPath = path.join(__dirname, "../data/skins.json");
  const data = await loadJson(jsonPath);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = data.slice(start, end);

  res.json({
    page,
    limit,
    totalItems: data.length,
    totalPages: Math.ceil(data.length / limit),
    data: paginated
  });
});

api.get("/skins/:id", async (req, res) => {
  const jsonPath = path.join(__dirname, "../data/skins.json");
  const data = await loadJson(jsonPath);

  const id = req.params.id;
  const skin = data.find(s => String(s.id) === String(id));

  if (!skin) {
    return res.status(404).json({ error: "Skin no encontrada" });
  }

  res.json(skin);
});

api.get("/crates", async (req, res) => {
  const jsonPath = path.join(__dirname, "../data/crates.json");
  const data = await loadJson(jsonPath);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = data.slice(start, end);

  res.json({
    page,
    limit,
    totalItems: data.length,
    totalPages: Math.ceil(data.length / limit),
    data: paginated
  });
});

api.get("/crates/:id", async (req, res) => {
  const jsonPath = path.join(__dirname, "../data/crates.json");
  const data = await loadJson(jsonPath);

  const crateId = req.params.id;

  const crate = data.find(c => c.id === crateId);

  if (!crate) {
    return res.status(404).json({ error: "Crate no encontrado" });
  }

  res.json(crate);
});

api.get("/crates/:id/skins", async (req, res) => {
  const crateId = req.params.id;

  const cratesPath = path.join(__dirname, "../data/crates.json");
  const skinsPath = path.join(__dirname, "../data/skins.json");

  const crates = await loadJson(cratesPath);
  const skins = await loadJson(skinsPath);

  const crate = crates.find(c => c.id === crateId);

  if (!crate) {
    return res.status(404).json({ error: "Crate no encontrada" });
  }

  // Filtrar skins cuyo crateid coincide
  const crateSkins = skins.filter(s => s.crateid === crateId);

  res.json(crateSkins);
});


// Endpoint para solicitar imagen por id
api.get("/skin-img/:id", (req, res) => {
  const { id } = req.params;

  // Definimos la ruta del archivo
  const possibleExtensions = [".png"];
  let imagePath = path.join(__dirname, "../public/img/skin", "skin.png");

  for (const ext of possibleExtensions) {
    const fullPath = path.join(__dirname, "../public/img/skin", id + ext);
    if (fs.existsSync(fullPath)) {
      imagePath = fullPath;
      break;
    }
  }
  // Enviar el archivo
  res.sendFile(imagePath);
});

api.get("/crate-img/:id", (req, res) => {
  const { id } = req.params;

  // Definimos la ruta del archivo
  const possibleExtensions = [".png"];
  let imagePath = path.join(__dirname, "../public/img/crate", "crate.png");

  for (const ext of possibleExtensions) {
    const fullPath = path.join(__dirname, "../public/img/crate", id + ext);
    if (fs.existsSync(fullPath)) {
      imagePath = fullPath;
      break;
    }
  }
  // Enviar el archivo
  res.sendFile(imagePath);
});

// simula abrir una caja
api.get("/open-case", async (req, res) => { 
  try {
    const jsonPath = path.join(__dirname, "../data/skins.json");
    const data = await loadJson(jsonPath);
    const skins = JSON.parse(data);

    console.log("/api/open-case - petición recibida");

    // Elegir aleatoriamente la skin ganadora
    const winningIndex = Math.floor(Math.random() * skins.length);
    const winningSkin = skins[winningIndex];

    // Enviar al frontend la lista de skins + la ganadora
    res.json({
      skins,
      winningSkin,
    });
  } catch (err) {
    console.error("Error en /api/open-case:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

api.post("/register", async (req, res) => {
  const { email, nickname, password, confirmPassword} = req.body;
  // Validaciones básicas
  if (!email || !password || !confirmPassword || !nickname) {
    return res.status(400).json({ error: "Datos faltantes" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Las contraseñas no coinciden" });
  }

  const jsonPath = path.join(__dirname, "../data/users.json");
  const users = jsonPath(jsonPath);

  // Verificar si ya existe el correo
  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "El correo ya está registrado" });
  }

  // Hashear contraseña
  const hashed = await bcrypt.hash(password, 10);

  const newUser = {
    id: "user-" + Date.now(), // milisegundos desde 1970
    email,
    nickname,
    password: hashed
  };

  //Agrega usuario generado al JSON
  users.push(newUser);
  saveJson(jsonPath, users); //Guarda datos en el json

  res.json({
    message: "Usuario registrado correctamente",
    user: {
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname
    }
  });
});

export default api*/