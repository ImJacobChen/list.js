module.exports = function arrayHasChildWithProperty(array, property) {
    for(let i = 0, il = array.length; i < il; i++) {
        if (array[i].hasOwnProperty(property)) {
            return true;
        }
    }
    return false;
}