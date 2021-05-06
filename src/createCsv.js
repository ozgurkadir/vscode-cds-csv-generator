const vscode = require('vscode');
const fs = require("fs");
const fse = require('fs-extra')
var path = require('path');
const { Parser } = require('json2csv');
const prepareCsv = require('./prepareCsv')
const entityDefinitionChecks = require('./entityDefinitionChecks')

const createCSVFiles = (collectedCSVDataLine, csvFolderPath) => {
  try {
    const fields = collectedCSVDataLine.columns

    const json2csvParser = new Parser({ fields, delimiter: ';', quote: '' });

    fs.writeFileSync(csvFolderPath + "/" + setCSVName(collectedCSVDataLine.entity) + ".csv", json2csvParser.parse(collectedCSVDataLine.data))
  } catch (error) {
    throw `An error occurred while saving CSV files!
    ${error.message}`
  }
}

const setCSVName = rawName => rawName.replace(/.([^.]*)$/, "-$1")

const copySapCommonFiles = csvFolderPath => vscode.workspace.getConfiguration().get('capCdsCsv.commonEntities') ?
  fse.copySync(path.join(__dirname, '/../sap-common-sample-files'), csvFolderPath, { overwrite: true }) : _

const createCSVFilesOut = (csnFilePath, csvFolderPath) => {
  try {

    copySapCommonFiles(csvFolderPath)
    prepareCsv.getCSVData(csnFilePath).map(collectedCSVData => createCSVFiles(collectedCSVData, csvFolderPath))

  } catch (error) {
    vscode.window.showErrorMessage(error)
  }
}

module.exports = {
  createCSVFilesOut
}