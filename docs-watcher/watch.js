const { exec } = require("child_process");
const chokidar = require("chokidar");

// One-liner for current directory
chokidar
  .watch(`${__dirname}/../api-specification`)
  .on("change", (event, path) => {
    exec(
      "redocly build-docs api-specification/api.yml --output=docs/specification.html"
    );
  });
