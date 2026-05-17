//codigo del cliente toma los datos del formulario y hace fetch al backend
const API_URL = "http://192.168.X.X:3000/api";

router.post("/register", async (req, res) => {
  const { email, password, confirmPassword, nickname } = req.body;

  if (!email || !password || !confirmPassword || !nickname) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Las contraseñas no coinciden" });
  }

  const users = loadUsers();

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "Usuario ya existe" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    nickname
  };

  users.push(newUser);
  saveUsers(users);

  res.json({ message: "Usuario registrado correctamente" });
});