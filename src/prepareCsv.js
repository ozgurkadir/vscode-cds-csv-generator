const vscode = require('vscode');
const fs = require("fs");
const definitionChecks = require('./entityDefinitionChecks')
const entityFieldChecks = require('./entityFieldChecks')
const randomDataGenerators = require('./randomDataGenerators')
const associationOrComposition = "associationOrComposition"
const associationAndComposition = ['cds.Association', 'cds.Composition'];

const csnFileOperations = require('./csnFileOperations')

const findEntitiestoCreateCSV = definitions => (Object.entries(definitions).reduce(
    (accumulator, currentValue) => (
        currentValue[1].kind === "entity" && findDefinitionstoCreateCSV(currentValue) ? [...accumulator, currentValue] : accumulator
    ), []
))

var findDefinitionstoCreateCSV = definition => definitionChecks.isAbstract(definition[1]) && definitionChecks.isProjection(definition[1]) &&
    definitionChecks.isView(definition[1]) && definitionChecks.isSAPCommonNamespce(definition[0]) &&
    definitionChecks.isStartsWithNamespace(definition[0]) && definitionChecks.isPersistenceSkip(definition[1]) ? true : false

const setColumnName = element => typeof element[1].keys !== 'undefined' ? element[0] + "_" + element[1].keys[0].ref[0] : element[0]

//CODE CLEANUP NEEDED !!! 
const prepreJSONForCSV = (elements) => {
    const allDefinitions = csnFileOperations.parsedCSNobj.csnGetObj
    let json = {}
    Object.entries(elements).forEach(function (element) {
        try {
            if (entityFieldChecks.checkFields(element))

                if (element[1].type in randomDataGenerators.randomDataGeneratorFunctions) {

                    if (element[1].enum) {
                        json[setColumnName(element)] = randomDataGenerators[randomDataGenerators.randomDataGeneratorFunctions["enum"]](Object.entries(element[1].enum))
                    } else {
                        json[setColumnName(element)] = randomDataGenerators[randomDataGenerators.randomDataGeneratorFunctions[element[1].type]]()
                    }
                } else if (typeof element[1].target !== 'undefined') {
                    if (typeof this.allDefinitions.definitions[element[1].target].elements[element[1].keys[0].ref[0]].type !== 'undefined') {
                        json[setColumnName(element)] = randomDataGenerators[randomDataGenerators.randomDataGeneratorFunctions[this.allDefinitions.definitions[element[1].target].elements[element[1].keys[0].ref[0]].type]]()
                    } else if (typeof this.allDefinitions.definitions[element[1].target].elements[element[1].keys[0].ref[0]].enum !== 'undefined') {
                        json[setColumnName(element)] = randomDataGenerators[randomDataGenerators.randomDataGeneratorFunctions["enum"]](Object.entries(this.allDefinitions.definitions[element[1].target].elements[element[1].keys[0].ref[0]].enum))
                    }
                } else if (typeof element[1].type !== 'undefined') {
                    json[setColumnName(element)] = randomDataGenerators[randomDataGenerators.randomDataGeneratorFunctions[this.allDefinitions.definitions[element[1].type].type]]()
                }
        } catch (error) {
            console.log('Error occcured!')
        }
    }, { allDefinitions: allDefinitions })

    return json
}

const getCompositionKey = (element, singleEntitytoCreateCSV) => {
    return element[1].on[2].ref[0]
}

const prepreEntityFieldsTypes = (singleEntitytoCreateCSV) => {
    let prepredEntityFieldsTypes = []

    Object.entries(singleEntitytoCreateCSV[1].elements).forEach(function (element) {
        prepredEntityFieldsTypes.push({
            name: (element[1].type === "cds.Association" && typeof element[1].keys !== 'undefined' ? element[0] + "_" + element[1].keys[0].ref[0] : element[0]),//element[0],
            type: element[1].type,
            target: element[1].target,
            key: (element[1].type === "cds.Association" && typeof element[1].keys !== 'undefined' ? element[1].keys[0].ref[0] : element[1].type === "cds.Composition" ? getCompositionKey(element, this.singleEntitytoCreateCSV) : undefined)
        })
    }, { singleEntitytoCreateCSV: singleEntitytoCreateCSV });

    return prepredEntityFieldsTypes
}

var generateCSVData = element => (Array.from(Array(vscode.workspace.getConfiguration().get('capCdsCsv.numberOfRows'))).map((_, i) => prepreJSONForCSV(element)))

const findKeyField = singleEntitytoCreateCSV => Object.entries(singleEntitytoCreateCSV[1].elements).filter(a => a[1].key)[0][0]


var entityJsonData = definitions =>
    definitions.map(singleEntitytoCreateCSV => ({
        entity: singleEntitytoCreateCSV[0],
        data: generateCSVData(singleEntitytoCreateCSV[1].elements),
        columns: Object.keys(generateCSVData(singleEntitytoCreateCSV[1].elements)[0]), //TODO : avoid calling multiple times
        types: prepreEntityFieldsTypes(singleEntitytoCreateCSV),
        associationAndCompositionTypes: prepreEntityFieldsTypes(singleEntitytoCreateCSV).filter(line => associationAndComposition.includes(line.type)),
        keyField: findKeyField(singleEntitytoCreateCSV)
    }), {}
    )

const mapEntityAssociationValues = (index, filteredLine, allDefinitions) => {
    return allDefinitions.find(element => element.entity === filteredLine.target).data[index][filteredLine.key]
}

const mapEntityCompositionValues = (index, filteredLine, allDefinitions) => {
    const keyfield = allDefinitions.find(element => element.entity === filteredLine.target).keyField
    return allDefinitions.find(element => element.entity === filteredLine.target).data[index][keyfield]
}
const arrangeData = (filteredLine, entityJsonDataLLine, allDefinitions) => {
    entityJsonDataLLine.data.forEach(function (element, index) {
        element[this.filteredLine.name] =
            this.filteredLine.type === "cds.Association" ? mapEntityAssociationValues(index, this.filteredLine, this.allDefinitions) :
                this.filteredLine.type === "cds.Composition" ? mapEntityCompositionValues(index, this.filteredLine, this.allDefinitions) : undefined

    }, { filteredLine: filteredLine, allDefinitions: allDefinitions });

}

const arrangeDataBeforeCreate = (entityJsonDataLLine, allDefinitions) => {
    return entityJsonDataLLine.associationAndCompositionTypes.map(filteredLine => arrangeData(filteredLine, entityJsonDataLLine, allDefinitions))
}

const createCSVFiles = (entityJsonDataLLine, allDefinitions) => {
    arrangeDataBeforeCreate(entityJsonDataLLine, allDefinitions)
    return entityJsonDataLLine
}

const createCSVFilesPrep = entityJsonData => {
    entityJsonData.forEach(
        function (element) {
            element = createCSVFiles(element, entityJsonData)
        })
    return entityJsonData
}

const getCSVData = csnFilePath => createCSVFilesPrep(entityJsonData(findEntitiestoCreateCSV(csnFileOperations.saveCSN(csnFilePath).definitions))) //TODO      

module.exports = {
    getCSVData
}