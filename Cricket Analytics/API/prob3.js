const csv = require('csv-parser');
const fs = require('fs');

var matchObj = {}
var finalObj = {}
var nfinalObj = {}
var batsman_runs = 0;

var total_runs = 0;
var nOver = 0;
var economy = 0;
var nball = 0;

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
            data.BALL === '1' ? (nOver = 1) : (nOver = 0);
            total_runs = parseInt(data.WIDE_RUNS) + parseInt(data.NOBALL_RUNS) + parseInt(data.PENALTY_RUNS) + parseInt(data.BATSMAN_RUNS) + parseInt(data.EXTRA_RUNS);
            var value = matchObj?.[nfinalObj[data.MATCH_ID]]?.[data.BOWLER];

            (value !== undefined) ? (
                matchObj[nfinalObj[data.MATCH_ID]] = {
                    ...matchObj[nfinalObj[data.MATCH_ID]],
                    [data.BOWLER]: {
                        "total runs": matchObj[nfinalObj[data.MATCH_ID]][data.BOWLER]["total runs"] + total_runs,
                        "balls": matchObj[nfinalObj[data.MATCH_ID]][data.BOWLER]["balls"] + 1,
                        "economy": ((matchObj[nfinalObj[data.MATCH_ID]][data.BOWLER]["total runs"] + total_runs) / Math.ceil((matchObj[nfinalObj[data.MATCH_ID]][data.BOWLER]["balls"] + 1) / 6)).toFixed(2)
                    }
                }
            ) : (
                matchObj[nfinalObj[data.MATCH_ID]] = {
                    ...matchObj[nfinalObj[data.MATCH_ID]],
                    [data.BOWLER]: {
                        "total runs": total_runs,
                        "balls": 1,
                        "economy": total_runs,
                    }
                }
            );

            //console.log(matchObj);
        })
        .on('end', function () {
            //some final operation
            for (const key in matchObj) {
                var i = 0;
                for (const keyi in matchObj[key]) {
                    if (matchObj[key][keyi]["balls"] / 6 < 10) {
                        continue;
                    }
                    var value = finalObj?.[key];
                    score = matchObj[key][keyi];
                    value === undefined ? finalObj[key] = [[keyi, score]] : finalObj[key].push([keyi, score]);
                }

            }

            console.log("PROB3 Completed");
            res.status(200).send(finalObj);
            res.end();

        });
}