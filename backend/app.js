const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const paginasRoutes = require("./routes/routePaginas");
const cadastroRoutes = require("./routes/routeCadastro");
const loginRoutes = require("./routes/routeLogin");
const adminRoutes = require("./routes/routeAdmin");
const routerLivros = require("./routes/routerLivros");
const criticasRoutes = require("./routes/criticasRoutes");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "chave_segura_local",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/", paginasRoutes);
app.use("/api", cadastroRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/livros", routerLivros);
app.use("/api", criticasRoutes);

module.exports = app;
