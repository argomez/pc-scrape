'use strict';
import { readFile } from 'node:fs/promises';
import { writeFileSync } from 'node:fs'

const CONFIG = {
    DATE: '2023_02_21', // date that the data was taken from personalcapital
    FILE_NAMES: ['accounts', 'histories'],
    DATA_INPUT_PATH: '../data/raw',
    DATA_OUTPUT_PATH: '../data/normalized',
}

// pretty print json
const prettyPrintJson = obj => console.log(JSON.stringify(obj, null, 2));

const readDataByDate = async date => {
    return Promise.all(CONFIG.FILE_NAMES.map(async type => {
        const filePath = new URL(`${CONFIG.DATA_INPUT_PATH}/${date}_${type}.raw.json`, import.meta.url);
        return readFile(filePath, { encoding: 'utf8' });
    })).then(datas => {
        // console.log(datas);
        const formattedData = {};
        for(let i = 0; i < CONFIG.FILE_NAMES.length; i++){
            formattedData[CONFIG.FILE_NAMES[i]] = JSON.parse(datas[i]);
        }
        // console.log(formattedData);
        return Promise.resolve(formattedData);
    });
}

const writeDataByDate = (date, data) => {
    writeFileSync(`${CONFIG.DATA_OUTPUT_PATH}/${date}.json`, JSON.stringify(data));
}


readDataByDate(CONFIG.DATE).then(data => {
    writeDataByDate(CONFIG.DATE, data);
});