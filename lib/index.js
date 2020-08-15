const { program } = require("commander")
const axios = require("axios")
const fs = require("fs")

module.exports = () => {
  // https://github.com/tj/commander.js/tree/v6.0.0#automated-help
  // https://github.com/tj/commander.js/tree/v6.0.0#required-option
  // https://github.com/tj/commander.js/tree/v6.0.0#commands
  // The arguments may be <required> or [optional]
  program
    .requiredOption("-r, --revision <number>", "revision number")
    .parse(process.argv)

  const zipUrl = `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2F${program.revision}%2Fchrome-linux.zip`
  const outputDirectory = "./"
  const outputFileName = `${program.revision}-chrome-linux.zip`
  const outputPath = outputDirectory + outputFileName

  // check file exists or not
  if (fs.existsSync(outputPath)) {
    console.log(`Already file exists. (${outputPath})`)
    process.exit(1)
  }

  console.log(`fetching ${zipUrl}`)

  // https://github.com/axios/axios/tree/v0.19.2#axios-api
  axios({
    method: "get",
    url: zipUrl,
    responseType: "stream",
    params: {
      alt: "media"
    }
  })
  .then(response => {
    response.data.pipe(fs.createWriteStream(outputPath))
  })
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
}
