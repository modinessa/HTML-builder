const fs = require("fs");
const { pipeline } = require("node:stream/promises");
const path = require("node:path");

const filePath = path.join(__dirname, "text.txt");

async function run() {
  await pipeline(fs.createReadStream(filePath), process.stdout);
}

run();
