
const fs = require('fs');
const path = require('path');
const package_info = require('./package_info.js');
const hash_calc = require('./hash_calc.js');

const sSystemdUnitsPath = '/lib/systemd/system/';
const sCurrentDir = process.cwd();
const sProcessExecutablePath = process.argv[0];
const sWorkinfDir = path.dirname(sProcessExecutablePath);

const sUnitTemplate = `
[Unit]
Description=${package_info.productName}
After=network-online.target

[Service]
Restart=on-failure
WorkingDirectory=${sWorkinfDir}
ExecStart=${sProcessExecutablePath}

[Install]
WantedBy=multi-user.target
`;

const sHash

module.exports = {
    fnInstall() { 
        if (fs.existsSync()) {

        }
        console.log(sUnitTemplate) 
    }
}