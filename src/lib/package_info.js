
module.exports = {
    fnGetPackage()
    {
        return require('../../package.json');
    },
    fnGetVersion()
    {
        return this.fnGetPackage().version;
    },
    fnGetApplicationName()
    {
        return this.fnGetPackage().productName;
    },
    get version()
    {
        return this.fnGetVersion();
    },
    get productName()
    {
        return this.fnGetApplicationName();
    }
}