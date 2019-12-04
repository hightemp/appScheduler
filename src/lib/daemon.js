
const fs = require('fs');
const cuid = require('cuid');
const moment = require('moment');
const exec = require('child_process').exec;
const userid = require('userid');

const sTasksFilePath = './tasks.json';

module.exports = {
    oTasks: {
        /**
         * cuid: {
         *  sName: "",
         *  sCommand: "",
         *  sUser: "",
         *  iUID: 0,
         *  sGroup: "",
         *  iGID: 0,
         *  iLastExecuteTimestamp: 0,
         *  iStartAtTimestamp: 0,
         *  sType: "periodicaly", // [ "periodicaly", "mask", "once" ]
         *  sPeriod: "", // ["secondly", "minutly", "hourly", "dayly", "weekly", "monthly"]
         *  iSecondsMask: "",
         *  iMinutesMask: "",
         *  iHoursMask: "",
         *  iDaysMask: "",
         *  iWeeksMask: "",
         *  iMonthsMask: "",
         * }
         */
    },
    fnLoadTasks()
    {
        if (fs.existsSync(sTasksFilePath)) {
            this.oTasks = JSON.parse(fs.readFileSync(sTasksFilePath).toString());
        }
    },
    fnSaveTasks()
    {
        fs.writeFileSync(sTasksFilePath, JSON.stringify(this.oTasks));
    },
    fnRunTask(oTask, oNowMoment)
    {
        var oThis = this;

        oTask.iLastExecuteTimestamp = oNowMoment.unix();
        oThis.fnSaveTasks();

    },
    fnLoop()
    {
        var oThis = this;
        this.fnLoadTasks();

        var aKeys = Object.keys(oThis.oTasks);

        aKeys.forEach((sKey) => {
            var oTask = oThis.oTasks[sKey];
            var oOptions = {};

            oOptions.uid = 0;

            try {
                if (oTask.sUser) {
                    oOptions.uid = userid.uid(oTask.sUser);
                } else if (oTask.iUID) {
                    oOptions.uid = oTask.iUID*1;
                }
            } catch(oError) {
                console.log(`${oTask.sUser} not found`)
            }

            try {
                if (oTask.sGroup) {
                    oOptions.gid = userid.gid(oTask.sGroup);
                } else if (oTask.iGID) {
                    oOptions.gid = oTask.iGID*1;
                }
            } catch(oError) {
                console.log(`${oTask.sGroup} not found`)
            }

            if (oTask.sType == "periodicaly") {
                var oLastExecuteMoment = moment.unix(oTask.iLastExecuteTimestamp);
                var oNowMoment = moment();

                var aPeriods = [
                    { sPeriod: "secondly", sUnitOfTime: "seconds" },
                    { sPeriod: "minutly", sUnitOfTime: "minuts" },
                    { sPeriod: "hourly", sUnitOfTime: "hours" },
                    { sPeriod: "dayly", sUnitOfTime: "days" },
                    { sPeriod: "weekly", sUnitOfTime: "weeks" },
                    { sPeriod: "monthly", sUnitOfTime: "months" }
                ];

                aPeriods.forEach((oItem) => {
                    if (oTask.sPeriod==oItem.sPeriod) {
                        if (oNowMoment.diff(oLastExecuteMoment, oItem.sUnitOfTime)>=1) {
                            oThis.fnRunTask(oTask, oNowMoment);
                        }
                    }
                });
                
                oTask.iLastExecuteTimestamp = moment().unix();

                oThis.fnSaveTasks();
            }
            if (oTask.sType == "mask") {
                
            }
            if (oTask.sType == "once") {
                
            }

            
        });

        setTimeout(oThis.fnLoop, 1000);
    },
    fnStart()
    {
        this.fnLoop();
    }
}