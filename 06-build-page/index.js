const fs = require("node:fs");
const path = require("node:path");
const { pipeline } = require("node:stream/promises");

const templateFile = path.join(__dirname, "template.html");
const outputDir = path.join(__dirname, "project-dist");
const componentsDir = path.join(__dirname, "components");
const stylesDir = path.join(__dirname, "styles");
const assetsDir = path.join(__dirname, "assets");

async function buildTemplate() {
  await fs.promises.mkdir(outputDir, { recursive: true });

  let template = (await fs.promises.readFile(templateFile)).toString();
  const componentFiles = await fs.promises.readdir(componentsDir);
  for (const file of componentFiles) {
    const componentFile = path.join(componentsDir, file);
    const stat = await fs.promises.stat(componentFile);
    if (!stat.isFile() || !file.endsWith(".html")) {
      continue;
    }

    const componentName = file.split(".").slice(0, -1).join(".");

    template = template.replace(
      `{{${componentName}}}`,
      (await fs.promises.readFile(componentFile)).toString()
    );
  }

  await fs.promises.writeFile(path.join(outputDir, "index.html"), template);
}

async function buildStyles() {
  const stream = fs.createWriteStream(path.join(outputDir, "style.css"));
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

async function copyAssets(rootDir, outputDir) {
  await fs.promises.mkdir(outputDir, { recursive: true });
  const files = await fs.promises.readdir(rootDir);

  for (const file of files) {
    const filePath = path.join(rootDir, file);
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      copyAssets(filePath, path.join(outputDir, file));
    } else {
      pipeline(
        fs.createReadStream(filePath),
        fs.createWriteStream(path.join(outputDir, file))
      );
    }
  }
}

async function run() {
  await fs.promises.rm(outputDir, { recursive: true });
  buildTemplate();
  buildStyles();
  copyAssets(assetsDir, path.join(outputDir, "assets"));
}

run();
