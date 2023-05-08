const fs = require("fs");
const path = require("node:path");
const { pipeline } = require("node:stream/promises");

const projectDir = path.join(__dirname, "project-dist");
const stylesDir = path.join(__dirname, "styles");

async function run() {
  const stream = fs.createWriteStream(path.join(projectDir, "bundle.css"));
  const files = await fs.promises.readdir(stylesDir);

  for (const file of files) {
    const filePath = path.join(stylesDir, file);
    const stat = await fs.promises.stat(filePath);
    if (!stat.isFile() || !file.endsWith(".css")) {
      continue;
    }

    fs.createReadStream(filePath).on("data", (data) => {
      stream.write(data);
      stream.write("\n");
    });
  }
}

run();
