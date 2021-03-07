const fs = require("fs");
const { v4: getRandomUUIDv4 } = require('uuid');
var path = require('path');
const mockJSON = (JSON.parse(fs.readFileSync(path.join(__dirname, '/../mock-data/mockStrings.json'))))
 
const getRandomTimestamp = _ => new Date(new Date(2018, 0, 1).getTime() + Math.random() * (new Date(20025, 0, 1).getTime() - new Date(20020, 0, 1).getTime()))
const getRandomInteger = _ => Math.floor(Math.random() * Math.floor(999))
const getRandomString = _ => mockJSON.word[Math.floor(Math.random() * Math.floor(999))]
const getRandomBoolean = _ => Math.random() < 0.5


module.exports = {
    getRandomTimestamp,
    getRandomInteger,
    getRandomString,
    getRandomBoolean,
    getRandomUUIDv4
}