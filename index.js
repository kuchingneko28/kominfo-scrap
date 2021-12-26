const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  const url = "https://www.kominfo.go.id/content/all/berita_satker";
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);
  let artikel = [];
  $(".blog-entry .content").each((index, element) => {
    let data = {
      thumbnail: "",
      //   date: "",
      title: "",
      description: "",
    };

    //console.log($(element).children(".title").text());
    data.thumbnail = $(element).children(".thumbnail-entry").children(".thumbnail-img").attr("src");
    // data.date = $(element).children(".date h2").text();
    data.title = $(element).children(".title").text();
    data.description = $(element).children(".description").text();

    artikel.push(data);
  });

  res.send(artikel);
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

// async function scrap() {
//   try {
//     const url = "https://www.kominfo.go.id/content/all/berita_satker";
//     const { data } = await axios.get(url);

//     const $ = cheerio.load(data);
//     let artikel = [];
//     $(".blog-entry .content").each((index, element) => {
//       let data = {
//         thumbnail: "",
//         title: "",
//         description: "",
//       };

//       //console.log($(element).children(".title").text());
//       data.thumbnail = $(element).children(".thumbnail-entry").children(".thumbnail-img").attr("src");
//       data.title = $(element).children(".title").text();
//       data.description = $(element).children(".description").text();

//       console.log(data);
//       artikel.push(data);
//     });

//     console.log(artikel);

//     return artikel;
//   } catch (err) {
//     if (err) {
//       return "API ERROR";
//     }
//   }
// }
