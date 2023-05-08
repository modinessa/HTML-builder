const fs = require("fs");
const { pipeline } = require("node:stream/promises");
const path = require("node:path");

const filePath = path.join(__dirname, "text.txt");

async function run() {
  console.log("Please, input text:");
  process.on("SIGINT", () => {
    console.log("Input finished");
    process.exit();
  });

  await pipeline(process.stdin, fs.createWriteStream(filePath));
}

run().catch(console.error);
