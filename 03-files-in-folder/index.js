const path = require("node:path");
const fs = require("fs");

const secretFolderPath = path.join(__dirname, "secret-folder");

fs.readdir(secretFolderPath, (err, files) => {
  for (const file of files) {
    fs.stat(path.join(secretFolderPath, file), (err, stat) => {
      readFileStat(file, stat);
    });
  }
});

function readFileStat(file, stat) {
  if (!stat.isFile()) {
    return;
  }
  const name = file.split(".");
  const ext = name.length > 1 ? name.pop() : "";
  console.log(
    `${name.join(".")} - ${ext} - ${(stat.size / 1024).toFixed(3)}kb`
  );
}
