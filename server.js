const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
require("dotenv").config();

const app = express();
const apiKey = process.env["WEATHER_API"];

app.set("view engine", "ejs");

app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.render("index", {weather:null, error:null});
});
app.post("/", function (req, res) {
  const cityName = req.body.city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
  request(url, function (err, resp, body) {
    if (err) {
      res.render("index", { weather: null, error: "Error!, Something is wrong" });
    } else {
      const weather = JSON.parse(body);
      if (weather.main) {
        res.render("index", { weather: `It's ${weather.main.temp} °C in ${weather.name}`, error: null });
      } else {
        res.render("index", { weather: null, error: "Error!, City not found" });
      }
    }
  });
});

app.listen(3000);
