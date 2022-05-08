const csv = require('csv-parser');
const fs = require('fs');

var nfinalObj = {}
var matchObjBat = {}
var matchObjBow = {}
var tempObj = { "netRunRate": 0, "team": '' }
var finalObj = {}
var batsman_runs = 0;
var total_runs = 0;
var temp_4 = 0;
var temp_6 = 0;

var count = 1;

module.exports = function (req, res) {
    /*write your code here*/
    fs.createReadStream('matches.csv')
        .pipe(csv())
        .on('data', (data) => {
            nfinalObj[data.MATCH_ID] = [data.SEASON];
        })
        .on('end', function () { });
    fs.createReadStream('deliveries.csv')
        .pipe(csv())
        .on('data', (data) => {
            total_runs = parseInt(data.WIDE_RUNS) + parseInt(data.BYE_RUNS) + parseInt(data.LEGBYE_RUNS) + parseInt(data.NOBALL_RUNS) + parseInt(data.PENALTY_RUNS) + parseInt(data.BATSMAN_RUNS) + parseInt(data.EXTRA_RUNS);

            var valuebat = matchObjBat?.[nfinalObj[data.MATCH_ID]]?.[data.BATTING_TEAM];
            (valuebat !== undefined) ? (
                matchObjBat[nfinalObj[data.MATCH_ID]] = {
                    ...matchObjBat[nfinalObj[data.MATCH_ID]],
                    [data.BATTING_TEAM]: {
                        "run scored": matchObjBat[nfinalObj[data.MATCH_ID]][data.BATTING_TEAM]["run scored"] + total_runs,
                        "balls faced": matchObjBat[nfinalObj[data.MATCH_ID]][data.BATTING_TEAM]["balls faced"] + 1,
                    }
                }
            ) : (
                matchObjBat[nfinalObj[data.MATCH_ID]] = {
                    ...matchObjBat[nfinalObj[data.MATCH_ID]],
                    [data.BATTING_TEAM]: {
                        "run scored": total_runs,
                        "balls faced": 1,
                    }
                }
            );
            var valuebow = matchObjBow?.[nfinalObj[data.MATCH_ID]]?.[data.BOWLING_TEAM];
            (valuebow !== undefined) ? (
                matchObjBow[nfinalObj[data.MATCH_ID]] = {
                    ...matchObjBow[nfinalObj[data.MATCH_ID]],
                    [data.BOWLING_TEAM]: {
                        "run conceaded": matchObjBow[nfinalObj[data.MATCH_ID]][data.BOWLING_TEAM]["run conceaded"] + total_runs,
                        "balls bowled": matchObjBow[nfinalObj[data.MATCH_ID]][data.BOWLING_TEAM]["balls bowled"] + 1,
                    }
                }
            ) : (
                matchObjBow[nfinalObj[data.MATCH_ID]] = {
                    ...matchObjBow[nfinalObj[data.MATCH_ID]],
                    [data.BOWLING_TEAM]: {
                        "run conceaded": total_runs,
                        "balls bowled": 1,
                    }
                }
            );

            //console.log(matchObj);
        })
        .on('end', function () {
            //some final operation
            for (const key in matchObjBat) {
                for (const keyi in matchObjBat[key]) {
                    var team = keyi;
                    var netRunRate =
                        ((parseInt(matchObjBat[key][keyi]["run scored"]) / ((Math.ceil(parseInt(matchObjBat[key][keyi]["balls faced"]) + 1) / 6)).toFixed(2)) -
                            (parseInt(matchObjBow[key][keyi]["run conceaded"]) / ((Math.ceil(parseInt(matchObjBow[key][keyi]["balls bowled"]) + 1) / 6)).toFixed(2))).toFixed(2);
                    if (tempObj["netRunRate"] < netRunRate) {
                        tempObj = { "netRunRate": netRunRate, "team": team };
                    }
                }
                finalObj[key] = {
                    ...tempObj
                }
            }

            console.log("PROB4 Completed");
            res.status(200).send(finalObj);
            res.end();

        });

}