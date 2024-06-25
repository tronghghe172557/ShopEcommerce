
const _ = require('lodash') // loadash hay để dấu _

const getInfoData = ({ files = [], object = {} }) => {
    return _.pick( object, files )
}

// ['a', 'b'] => {a: 1, b: 1} // chuyển từ array => OBJ
const getSelectData = ( select = [] ) => {
    return Object.fromEntries( select.map(el => [el, 1]) )
}

// ['a', 'b'] => {a: 0, b: 0} // chuyển từ array => OBJ
const unGetSelectData = ( select = [] ) => {
    return Object.fromEntries( select.map(el => [el, 0]) )
}

// xoá những thuộc tính có giá trị = null trong obj
const removeUndefinedObject = obj => {
    Object.keys(obj).forEach( key => {
        if(obj[key] == null) {
            delete obj[key];
        }
    })

    return obj
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject
}