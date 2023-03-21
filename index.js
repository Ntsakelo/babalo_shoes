"use strict";
import express, { application } from "express";
import handlebars from "express-handlebars";
import bodyParser from "body-parser";
import session from "express-session";
import flash from "express-flash";
import pgPromise from "pg-promise";
import ShoesData from "./shoesData.js";
import shoesApi from "./api/shoes-api.js";
import ShoesRoutes from "./routes/shoesCatRoutes.js";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import Jwt from "jsonwebtoken";
const pgp = pgPromise();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://coder:pg123@localhost:5432/shoes_catalogue";

const config = {
  connectionString: DATABASE_URL,
};

if (process.env.NODE_ENV == "production") {
  config.ssl = {
    rejectUnauthorized: false,
  };
}

const db = pgp(config);

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static("public"));

const shoesData = ShoesData(db);

const shoesAPI = shoesApi(shoesData);
const shoesRoutes = ShoesRoutes(shoesData);
function checkAuth(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.json({
      status: "No token found",
    });
  }
  Jwt.verify(token, `${process.env.SECRET_KEY}`, function (err, userId) {
    if (err) {
      return res.json({
        status: "Invalid token",
      });
    }
    req.user = {
      id: userId,
    };
    next();
  });
}
app.get("/api/shoes", shoesAPI.displayProducts);
app.get("/api/brands", shoesAPI.showBrands);
app.get("/api/sizes", shoesAPI.showSizes);
app.get("/api/colors", shoesAPI.showColors);
app.get("/api/shoes/selected/:id", shoesAPI.getShoe);
app.get("/api/shoes/brand/:brandname", shoesAPI.searchBrand);
app.get("/api/shoes/size/:size", shoesAPI.searchSize);
app.get("/api/shoes/color/:color", shoesAPI.searchColor);
app.get("/api/shoes/brand/:brandname/color/:color", shoesAPI.searchBrandColor);
app.get("/api/shoes/size/:size/color/:color", shoesAPI.searchSizeColor);
app.get("/api/shoes/brand/:brandname/size/:size", shoesAPI.searchBrandSize);
app.get(
  "/api/shoes/brand/:brandname/size/:size/color/:color",
  shoesAPI.searchAll
);
app.get(
  "/api/shoes/addToCart/item/:id/quantity/:qty/size/:size",
  shoesAPI.addToCart
);
app.get("/api/shoes/cartCount", shoesAPI.countItems);
app.get("/api/category", shoesAPI.getCategories);
app.get("/api/shoes/:category", shoesAPI.showByCategory);
app.get("/api/orders", shoesAPI.viewCart);
app.get("/api/orders/edit/:qty/:orderId", shoesAPI.qtyUpdate);
app.get("/api/remove/confirm/:id", shoesAPI.confirm);
app.get("/api/remove/:id", shoesAPI.remove);
app.get("/api/checkout", checkAuth, shoesAPI.checkOut);
app.get("/api/myOrders", checkAuth, shoesAPI.orders);
app.post("/api/register", shoesAPI.registerUser);
app.post("/api/login", shoesAPI.login);
app.get("/api/verify", shoesAPI.checkLogin);
app.get("/api/logout", shoesAPI.logout);

const PORT = process.env.PORT || 3060;
app.listen(PORT, function () {
  console.log("app started at port : ", PORT);
});
app.get("/", shoesRoutes.home);
app.post("/login", shoesRoutes.login);

app.use(function (req, res, next) {
  let user = req.session.user;
  if (!user) {
    if (req.path === "/") {
      next();
    } else if (req.path !== "/") {
      res.redirect("/");
    }
  } else if (user) {
    next();
  }
});
app.get("/admin", shoesRoutes.admin);
app.get("/logout", shoesRoutes.logout);
app.post("/stockUpdate", shoesRoutes.addToStock);
app.post("/sale", shoesRoutes.addSale);
