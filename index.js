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
  const param = req.query.name;

  for (let i = 0; i < kominfo.length; i++) {
    if (param == kominfo[i]["url"]) {
      const article = await getArticle(param);

      return res.send(article);
    }
  }
  res.send(kominfo);
  // const kominfo = await scrap(beritaKominfo);
});

// bagian berita pemerintah
app.get("/berita-pemerintah", async (req, res) => {
  const pemerintah = await scrap(beritaPemerintah);
  const param = req.query.name;

  for (let i = 0; i < pemerintah.length; i++) {
    if (param == pemerintah[i]["url"]) {
      const article = await getArticle(param);

      return res.send(article);
    }
  }
  res.send(pemerintah);
});

// bagian hoax
app.get("/berita-hoax", async (req, res) => {
  const hoax = await scrap(beritaHoax);
  const param = req.query.name;

  for (let i = 0; i < hoax.length; i++) {
    if (param == hoax[i]["url"]) {
      const article = await getArticle(param);

      return res.send(article);
    }
  }
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

async function getArticle(param) {
  const newsURL = "https://www.kominfo.go.id" + param;

  const { data } = await axios.get(newsURL);

  const $ = cheerio.load(data);
  let article = [];

  $(".blog-entry").each((index, element) => {
    $(element)
      .find(".content")
      .each((index, element) => {
        const thumbnail = $(element).children(".thumbnail-entry").children(".thumbnail-img").attr("src");
        const title = $(element).children(".title").text();
        const parag = $(element).children(".typography-block").text();
        const catagory = $(element).children(".author").children("b").text();

        article.push({ thumbnail, title, catagory, parag });
      });
  });
  return article;
}
