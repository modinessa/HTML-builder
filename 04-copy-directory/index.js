const fs = require("fs");
const path = require("node:path");

const sourcesDir = path.join(__dirname, "files");
const destinationDir = path.join(__dirname, "files-copy");

async function run() {
  await fs.promises.mkdir(destinationDir, { recursive: true });

  const files = await fs.promises.readdir(sourcesDir);

  for (const file of files) {
    const filePath = path.join(sourcesDir, file);
    const stat = await fs.promises.stat(filePath);

    if (!stat.isFile()) {
      continue;
    }
    await fs.promises.copyFile(filePath, path.join(destinationDir, file));
  }
}

run();
