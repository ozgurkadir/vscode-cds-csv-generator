const fs = require("fs");
const vscode = require('vscode');

const parsedCSNobj = {
    csnObj: {},

    get csnGetObj() {
        return this.csnObj
    },
    set csnSetObj(csn) {
        this.csnObj = csn
    },
};

const parseCSN = csnPath => 
{
    try {
        vscode.window.showInformationMessage('CSN Parsing Started')
       return JSON.parse(fs.readFileSync(csnPath))
    } catch (error) {
        throw `CSN Parsing Error!
        ${error.message}`
    }
}

const saveCSN = csnPath => {
    const parsedCSN = parseCSN(csnPath)
    parsedCSNobj.csnSetObj = parsedCSN
    
    return parsedCSN
}

const showCSN = _ => parsedCSNobj.csnGetObj

 module.exports = {
    saveCSN,
    showCSN,
    parsedCSNobj
}