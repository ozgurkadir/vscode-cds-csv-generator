const fs = require("fs");
const { Parser } = require('json2csv');
const prepareCsv = require('./prepareCsv')
const entityDefinitionChecks = require('./entityDefinitionChecks')

const createCSVFiles = (collectedCSVDataLine, csvFolderPath) => {
  const fields = collectedCSVDataLine.columns

  const json2csvParser = new Parser({ fields, delimiter: ';', quote: '' });
  fs.writeFileSync(csvFolderPath + "/" + collectedCSVDataLine.entity + ".csv", json2csvParser.parse(collectedCSVDataLine.data))
}

const createCSVFilesOut = (csnFilePath, csvFolderPath) => prepareCsv.getCSVData(csnFilePath).map(collectedCSVData => createCSVFiles(collectedCSVData,csvFolderPath))

module.exports = {
    createCSVFilesOut
}