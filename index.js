const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

const port = process.env.PORT || 3000;
const url = "https://www.kominfo.go.id/content/all/berita";

app.get("/", (req, res) => {
  res.send("Untuk mengakses : http:///url/api");
});
app.get("/api", async (req, res) => {
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);
  let artikel = [];
  $(".content").each((index, element) => {
    let data = {
      thumbnail: "",
      date: "",
      title: "",
      description: "",
    };

    $(".data-column").each((index, element) => {
      data.date = $(element).children(".date").text();
    });

    data.thumbnail = $(element).children(".thumbnail-entry").children(".thumbnail-img").attr("src");
    data.title = $(element).children(".title").text();
    data.description = $(element).children(".description").text();

    artikel.push(data);
  });

  res.send(artikel);
});

app.listen(port, () => {
  console.log(`Server running at port ${port}.`);
});
