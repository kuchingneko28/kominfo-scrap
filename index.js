const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { status } = require("express/lib/response");
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
      status: res.statusCode,
      berita: ["/berita-kominfo", "/berita-pemerintah", "/berita-hoax"],
      artikel: ["/get-article"],
    },
  ];
  res.send(list);
});

// Bagian artikel
app.get("/get-article", async (req, res) => {
  const param = req.query;

  if (param["url"]) {
    const run = await validation(param);
    res.send(run);
  } else {
    res.send({ info: "masukan link article ke parameter menggunakan query ?url=, untuk link artikel ada didalam parameter berita" });
  }
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

  let article = [];
  let label = [];

  $(".blog-entry").each((index, element) => {
    $(element)
      .find(".data-column")
      .each((index, element) => {
        const date = $(element).children(".date").text();
        const views = $(element).children(".data-entry").text();
        label.push({ date, views });
      });

    // // mencari tag & value
    $(element)
      .find(".content")
      .each((index, element) => {
        const thumbnail = $(element).children(".thumbnail-entry").children(".thumbnail-img").attr("src");
        const title = $(element).children(".title").text();
        const url = $(element).children(".title").attr("href");
        const catagory = $(element).children(".author").children("b").text();
        const description = $(element).children(".description").text();

        article.push({ label: label[index], thumbnail, title, url, catagory, description });
      });
    // push data article  ke array
  });
  // return array
  return article;
}

async function scrapArticle(url) {
  const newUrl = "http://kominfo.go.id" + url;
  const { data } = await axios.get(newUrl);

  const $ = cheerio.load(data);

  const date = $(".data-column").find(".date").text();
  const views = $(".data-column").find(".data-entry").text();
  const thumbnail = $(".content").find(".thumbnail-entry").children(".thumbnail-img").attr("src");
  const title = $(".content").find(".title").text();
  const paragraph = $(".content").find(".typography-block").text();
  const catagory = $(".content").find(".author").children("b").text();

  return { title, date, views, thumbnail, catagory, paragraph };
}

async function validation(param) {
  const kominfo = await scrap(beritaKominfo);
  const pemerintah = await scrap(beritaPemerintah);
  const hoax = await scrap(beritaHoax);
  for (let i = 0; i < kominfo.length; i++) {
    if (param["url"] === kominfo[i]["url"] || param["url"] === pemerintah[i]["url"] || param["url"] === hoax[i]["url"]) {
      const get = await scrapArticle(param["url"]);
      return get;
    } else {
      console.log("Not found 404");
    }
  }
}
