const fs = require("fs");
const stream = require("node:stream");
const path = require("node:path");

const FILE_PATH =
  "D:\\Inell\\Study_projects\\RS_School_projects\\HTML-builder\\text.txt";

const filePath = path.join("./01-read-file", path.basename(FILE_PATH));

fs.readFile(filePath, (err, data) => {
  if (err) throw new Error("Oh, no! Something went wrong!");
  console.log(data.toString());
});
