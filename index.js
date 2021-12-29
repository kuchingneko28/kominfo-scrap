const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const port = process.env.PORT || 3000;

// link untuk scrap
const beritaKominfo = "https://www.kominfo.go.id/content/all/berita_satker";
const beritaPemerintah = "https://www.kominfo.go.id/content/all/berita";
const beritaHoax = "https://www.kominfo.go.id/content/all/laporan_isu_hoaks";

// info
app.get("/", (req, res) => {
  const list = [
    {
      status: "200",
      parameter: ["/berita-kominfo", "/berita-pemerintah", "/berita-hoax"],
    },
  ];
  res.send(list);
});

// bagian berita kominfo
app.get("/berita-kominfo", async (req, res) => {
  const kominfo = await scrap(beritaKominfo);

  res.send(kominfo);
});

// bagian berita pemerintah
app.get("/berita-pemerintah", async (req, res) => {
  const pemerintah = await scrap(beritaPemerintah);

  res.send(pemerintah);
});

// bagian hoax
app.get("/berita-hoax", async (req, res) => {
  const hoax = await scrap(beritaHoax);

  res.send(hoax);
});

// check jika server running
app.listen(port, () => {
  console.log(`Server running at port ${port}.`);
});

// bagian function
async function scrap(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  let artikel = [];

  $(".content").each((index, element) => {
    let data = {
      thumbnail: "",
      date: "",
      views: "",
      catagory: "",
      title: "",
      description: "",
    };

    $(".data-column").each((index, element) => {
      data.date = $(element).children(".date").text();
      data.views = $(element).children(".data-entry").text();
    });

    // mencari tag & value
    data.thumbnail = $(element).children(".thumbnail-entry").children(".thumbnail-img").attr("src");
    data.title = $(element).children(".title").text();
    data.catagory = $(element).children(".author").children("b").text();
    data.description = $(element).children(".description").text();

    // push data artikel  ke array
    artikel.push(data);
  });

  // return array
  return artikel;
}
