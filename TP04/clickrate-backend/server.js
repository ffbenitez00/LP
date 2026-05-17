import express from "express";
import cors from "cors";
import path from "path";
import apiRoutes from "./routes/api.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ error: "Acceso no autorizado" });
  }
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
// middlewares
app.use(cors());
app.use(express.json());

// Fondos
app.use("/img", express.static(path.join(process.cwd(), "img")));

// Skins (IMÁGENES)
app.use("/skin-img", express.static(path.join(process.cwd(), "img/skin")));
// cajas (IMAGENES)
app.use("/crates-img", express.static(path.join(process.cwd(), "img/crate")))
// API (JSON)
app.use("/api", apiRoutes);

app.get('/items', verifyToken, (req, res) => {
  res.json({ data: 'Solo usuarios logueados' });
});
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server corriendo en puerto", PORT);
});

/*import express from "express"
import path from "path"
import url from "url";
import cors from "cors";
import pageRoutes from "./routes/pages.js";
import apiRoutes from "./routes/api.js";

const app = express()
const PORT = 3000
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors()); // habilita CORS para todos los orígenes
app.use(express.json());

// 🔹 Middleware de depuración — muestra todas las rutas que llegan
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});

// Servir archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, "public")))

// Rutas de pages
app.use("/", pageRoutes)

// endpoints de datos
app.use("/api", apiRoutes)

//iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});*/