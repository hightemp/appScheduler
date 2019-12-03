
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
                }
            } catch(oError) {
                console.log(`${oTask.sUser} not found`)
            }

            if (oTask.sType == "periodicaly") {
                var oLastExecuteMoment = moment.unix(oTask.iLastExecuteTimestamp);
                var oNowMoment = moment();

                if (oTask.sPeriod=="secondly") {
                    if (oNowMoment.diff(oLastExecuteMoment, 'seconds')>=1) {
                        oTask.iLastExecuteTimestamp = oNowMoment.unix();
                        oThis.fnSaveTasks();
                    }
                }
                if (oTask.sPeriod=="minutly") {
                    if (oNowMoment.diff(oLastExecuteMoment, 'minuts')>=1) {
                        oTask.iLastExecuteTimestamp = oNowMoment.unix();
                        oThis.fnSaveTasks();
                    }                    
                }
                if (oTask.sPeriod=="hourly") {
                    if (oNowMoment.diff(oLastExecuteMoment, 'hours')>=1) {
                        oTask.iLastExecuteTimestamp = oNowMoment.unix();
                        oThis.fnSaveTasks();
                    }                   
                }
                if (oTask.sPeriod=="dayly") {
                    if (oNowMoment.diff(oLastExecuteMoment, 'days')>=1) {
                        oTask.iLastExecuteTimestamp = oNowMoment.unix();
                        oThis.fnSaveTasks();
                    }
                }
                if (oTask.sPeriod=="weekly") {
                    if (oNowMoment.diff(oLastExecuteMoment, 'weeks')>=1) {
                        oTask.iLastExecuteTimestamp = oNowMoment.unix();
                        oThis.fnSaveTasks();
                    }
                }
                if (oTask.sPeriod=="monthly") {
                    if (oNowMoment.diff(oLastExecuteMoment, 'months')>=1) {
                        oTask.iLastExecuteTimestamp = oNowMoment.unix();
                        oThis.fnSaveTasks();
                    }
                }

                
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