const fs = require("fs");
const definitionChecks = require('./entityDefinitionChecks')
const entityFieldChecks = require('./entityFieldChecks')
const randomDataGenerators = require('./randomDataGenerators')
const associationOrComposition = "associationOrComposition"
const associationAndComposition = ['cds.Association', 'cds.Composition'];

const parsedCSN = csnPath => JSON.parse(fs.readFileSync(csnPath))

const findEntitiestoCreateCSV = definitions => (Object.entries(definitions).reduce(
    (accumulator, currentValue) => (
        currentValue[1].kind === "entity" && findDefinitionstoCreateCSV(currentValue) ? [...accumulator, currentValue] : accumulator
    ), []
))

var findDefinitionstoCreateCSV = definition => definitionChecks.isAbstract(definition[1]) && definitionChecks.isProjection(definition[1]) &&
    definitionChecks.isView(definition[1]) && definitionChecks.isSAPCommonNamespce(definition[0]) &&
    definitionChecks.isStartsWithNamespace(definition[0]) ? true : false

const prepreJSONForCSV = (elements) => {
    return Object.entries(elements).reduce((json, element) => {
        if( entityFieldChecks.checkFields(element))
        switch (element[1].type) {
            case "cds.Timestamp":
                json[element[0]] = randomDataGenerators.getRandomTimestamp()
                break;
            case "cds.Integer":
                json[element[0]] = randomDataGenerators.getRandomInteger()
                break;
            case "cds.String":
                json[element[0]] = randomDataGenerators.getRandomString()
                break;
            case "cds.UUID":
                json[element[0]] = randomDataGenerators.getRandomUUIDv4()
                break;
            case "cds.Boolean":
                json[element[0]] = randomDataGenerators.getRandomBoolean()
                break;
            case "cds.Association":
                json[element[0] + "_" + element[1].keys[0].ref[0]] = associationOrComposition + "-" + element[1].target + "-" + element[1].keys[0].ref[0]
                break;
            case "cds.Composition":
                //  json[element[0]] = associationOrComposition + "-" + element[1].target + "-" + element[1].on[2].ref[0]
                break;
            default:
                json[element[0]] = ""
        }
        return json
    }, {})
}

const getCompositionKey = (element, singleEntitytoCreateCSV) => {
    return element[1].on[2].ref[0]
}

const prepreEntityFieldsTypes = (singleEntitytoCreateCSV) => {
    let prepredEntityFieldsTypes = []

    Object.entries(singleEntitytoCreateCSV[1].elements).forEach(function (element) {
        prepredEntityFieldsTypes.push({
            name: (element[1].type === "cds.Association" ? element[0] + "_" + element[1].keys[0].ref[0] : element[0]),//element[0],
            type: element[1].type,
            target: element[1].target,
            key: (element[1].type === "cds.Association" ? element[1].keys[0].ref[0] : element[1].type === "cds.Composition" ? getCompositionKey(element, this.singleEntitytoCreateCSV) : undefined)
        })
    }, { singleEntitytoCreateCSV: singleEntitytoCreateCSV });

    return prepredEntityFieldsTypes
}

var generateCSVData = element => (Array.from(Array(10)).map((_, i) => prepreJSONForCSV(element)))

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

    /*
const filterAssociationCompositionFields = (entityJsonDataLLine) =>
    entityJsonDataLLine.associationAndCompositionTypes.filter(associationAndCompositionTypesLine =>
        associationAndCompositionTypesLine.entity === entityJsonDataLLine.entity)
*/

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

const getCSVData = csnFilePath => createCSVFilesPrep(entityJsonData(findEntitiestoCreateCSV(parsedCSN(csnFilePath).definitions))) //TODO      


module.exports = {
    getCSVData,
    parsedCSN
}