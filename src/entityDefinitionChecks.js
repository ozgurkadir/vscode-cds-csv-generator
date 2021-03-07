
var namespace = {
    nameSpaceValue: "",
    set nameSpace(selectedNameSpace) {
        this.nameSpaceValue = selectedNameSpace
    },
    get nameSpace() {
        return this.nameSpaceValue
    }
}

const isAbstract = x => x.abstract !== true ? true : false
const isProjection = x => x.$syntax !== 'projection' ? true : false
const isView = x => x.$syntax !== 'view' ? true : false
const isSAPCommonNamespce = x => x.includes("sap.common") ? false : true
const isStartsWithNamespace = x => x.startsWith(namespace.nameSpace) ? true : false


module.exports = {
    isAbstract,
    isProjection,
    isView,
    isSAPCommonNamespce,
    isStartsWithNamespace,
    namespace
}