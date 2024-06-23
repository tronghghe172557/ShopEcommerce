
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

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
}