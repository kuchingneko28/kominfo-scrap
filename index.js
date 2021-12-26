const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const port = process.env.PORT || 3000;

// link untuk scrap
const beritaKominfo = "https://www.kominfo.go.id/content/all/berita_satker";
const beritaPemerintah = "https://www.kominfo.go.id/content/all/berita";
const beritaHoax = "https://www.kominfo.go.id/content/all/laporan_isu_hoaks";

//info
app.get("/", (req, res) => {
  res.send("untuk akses : http://url/parameter");
});

app.get("/berita-kominfo", async (req, res) => {
  const response = await scrap(beritaKominfo);
  const $ = cheerio.load(response);
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

// bagian berita
app.get("/berita-pemerintah", async (req, res) => {
  const response = await scrap(beritaPemerintah);
  const $ = cheerio.load(response);

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

// bagian hoax
app.get("/berita-hoax", async (req, res) => {
  const response = await scrap(beritaHoax);
  const $ = cheerio.load(response);
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

    artikel.push(data);
  });

  res.send(artikel);
});

// check jika server running
app.listen(port, () => {
  console.log(`Server running at port ${port}.`);
});

// bagian function
async function scrap(url) {
  const { data } = await axios.get(url);

  return data;
}
