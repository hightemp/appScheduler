
const fs = require('fs');
const path = require('path');
const package_info = require('./package_info.js');
const hash_calc = require('./hash_calc.js');
const spawnSync = require('child_process').spawnSync;

const sSystemdUnitsPath = '/lib/systemd/system/';
const sCurrentDir = process.cwd();
const sProcessExecutablePath = process.argv[0];
const sWorkinfDir = path.dirname(sProcessExecutablePath);
const sUnitFileName = package_info.productName+'.service';
const sUnitFilePath = path.join(sSystemdUnitsPath, sUnitFileName);

const sUnitTemplate = `
[Unit]
Description=${package_info.productName}
After=network-online.target

[Service]
Restart=on-failure
WorkingDirectory=${sWorkinfDir}
ExecStart=${sProcessExecutablePath} -d

[Install]
WantedBy=multi-user.target
`;

const sGeneratedUnitHash = hash_calc.fnCalcHash(sUnitTemplate); 
var sUnitHash = '';

module.exports = {
    fnInstall() 
    { 
        if (fs.existsSync(sUnitFilePath)) {
            sUnitHash = hash_calc.fnCalcHashOfFile(sUnitFilePath);
            if (sGeneratedUnitHash == sUnitHash) {
                return false;
            }
        }
        fs.writeFileSync(sUnitFilePath, sUnitTemplate);

        spawnSync('systemctl daemon-reload');
        spawnSync(`systemctl enable ${sUnitFileName}`);
        spawnSync(`systemctl restart ${sUnitFileName}`);

        console.log(sUnitTemplate) 

        return true;
    }
}