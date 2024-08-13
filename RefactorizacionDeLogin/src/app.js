import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import indexRouter from './routes/index.router.js'
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import sessionsRouter from './routes/api/sessions.js';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

app.engine('handlebars',  hbs.engine)
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

console.log(__dirname)

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://sandovalaes:Tomate24-@cluster0.bqinruk.mongodb.net/' }),
    // cookie: { maxAge: 180 * 60 * 1000 },
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

mongoose
    .connect(
    "mongodb+srv://sandovalaes:Tomate24-@cluster0.bqinruk.mongodb.net/"
    )
    .then(() => {
    console.log("Conectado a la base de datos");
    })
    .catch((error) => console.error("Error en la conexion", error));

app.listen(PORT, () => {
    console.log(`Servidor corriendo sobre el puerto ${PORT}`);
});
