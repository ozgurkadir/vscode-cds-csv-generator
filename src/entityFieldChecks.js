const isFieldNotVirtual = element => !element[1].virtual


const checkFields = element => isFieldNotVirtual(element)


module.exports = {
    checkFields
}