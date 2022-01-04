const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const scrap = require("./routes/scrap");
// info
app.get("/", (req, res) => {
  const list = [
    {
      status: res.statusCode,
      berita: ["/berita-kominfo", "/berita-pemerintah", "/berita-hoax", "/siaran-pers"],
      artikel: ["/get-article"],
    },
  ];
  res.send(list);
});

// panggil scrap
app.use(scrap);

// check jika server running
app.listen(port, () => {
  console.log(`Server running at port ${port}.`);
});
