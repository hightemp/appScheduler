const crypto = require('crypto');
const fs = require('fs');

module.exports = {
    fnCalcHash(str, algorithm='md5', encoding='utf8')
    {
        return crypto
            .createHash(algorithm || 'md5')
            .update(str, 'utf8')
            .digest(encoding || 'hex')
    },

    fnCalcHashOfFile(sFilePath, algorithm='md5', encoding='utf8')
    {
        this.fnCalcHash(fs.readFileSync(sFilePath), algorithm, encoding);
    }
}