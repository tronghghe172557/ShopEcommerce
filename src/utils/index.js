
const _ = require('lodash') // loadash hay để dấu _

const getInfoData = ({ files = [], object = {} }) => {
    return _.pick( object, files )
}

module.exports = {
    getInfoData
}