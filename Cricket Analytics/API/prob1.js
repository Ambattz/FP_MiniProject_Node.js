const csv = require('csv-parser');
const fs = require('fs');

var countObj = {};
var data16 = {};
var data17 = {};

module.exports = function (req, res) {
    fs.createReadStream('matches.csv')
        .pipe(csv())
        .on('data', (data) => {
            if (data.TOSS_DECISION === 'field' && data.SEASON === '2016') {
                data.CITY in data16 ? data16[data.CITY] = data16[data.CITY] + 1 : data16[data.CITY] = 1;
            }
            if (data.TOSS_DECISION === 'field' && data.SEASON === '2017') {
                data.CITY in data17 ? data17[data.CITY] = data17[data.CITY] + 1 : data17[data.CITY] = 1;
            }
        })
        .on('end', function () {
            //some final operation
            sortedd16 = Object.keys(data16).sort(function (a, b) { return data16[b] - data16[a] }).slice(0, 4).sort();
            sortedd17 = Object.keys(data17).sort(function (a, b) { return data17[b] - data17[a] }).slice(0, 4).sort();
            for (i = 0; i < sortedd16.length; i++) {
                countObj['2016'] = { ...countObj['2016'], [i]: [sortedd16[i], data16[sortedd16[i]]] }
                countObj['2017'] = { ...countObj['2017'], [i]: [sortedd17[i], data17[sortedd17[i]]] }
            }
            console.log("PROB1 Completed");
            res.status(200).send(countObj);
            res.end();
        });
}