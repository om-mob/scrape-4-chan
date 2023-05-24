import express from "express";

import get_data from "../scraper/get_data";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  /***** extract url from query string *****/
  const url = req.query.url as string;
  if (!url) return res.status(400).json({ statusCode: 400, message: "Provide 4chan url in query" })

  const data = get_data(url);
  res.status(200).json({ statusCode: 200, data });
});




app.listen(port, () =>
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
);
