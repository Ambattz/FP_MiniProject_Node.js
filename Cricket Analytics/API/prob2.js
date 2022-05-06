const csv = require('csv-parser');
const fs = require('fs');

var matchObj = {}
var finalObj = {}
var nfinalObj = {}

var batsman_runs = 0;
var total_runs = 0;
var temp_4 = 0;
var temp_6 = 0;

module.exports = function (req, res) {
    /*write your code here*/
    fs.createReadStream('matches.csv')
        .pipe(csv())
        .on('data', (data) => {
            nfinalObj[data.MATCH_ID] = [data.SEASON];
        })
        .on('end', function () { console.log("ID Season Created"); });
    fs.createReadStream('deliveries.csv')
        .pipe(csv())
        .on('data', (data) => {
            data.BATSMAN_RUNS === '4' ? (temp_4 = 1) : (temp_4 = 0);
            data.BATSMAN_RUNS === '6' ? (temp_6 = 1) : (temp_6 = 0);
            var value = matchObj?.[nfinalObj[data.MATCH_ID]]?.[data.BATTING_TEAM];
            (value !== undefined) ? (
                matchObj[nfinalObj[data.MATCH_ID]] = {
                    ...matchObj[nfinalObj[data.MATCH_ID]],
                    [data.BATTING_TEAM]: {
                        "count4": matchObj[nfinalObj[data.MATCH_ID]][data.BATTING_TEAM]["count4"] + temp_4,
                        "count6": matchObj[nfinalObj[data.MATCH_ID]][data.BATTING_TEAM]["count6"] + temp_6,
                        "total runs": parseInt(data.TOTAL_RUNS) + matchObj[nfinalObj[data.MATCH_ID]][data.BATTING_TEAM]["total runs"]
                    }
                }) : (
                matchObj[nfinalObj[data.MATCH_ID]] = {
                    ...matchObj[nfinalObj[data.MATCH_ID]],
                    [data.BATTING_TEAM]: {
                        "count4": temp_4,
                        "count6": temp_6,
                        "total runs": parseInt(data.TOTAL_RUNS)
                    }
                });
        })
        .on('end', function () {
            //some final operation
            res.status(200).send(matchObj);
            res.end();
        });
}
