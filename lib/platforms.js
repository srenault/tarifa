var path = require('path'),
    cordova_platform_add = require('cordova/src/platform').add,
    cordova_util = require('cordova/src/util'),
    cordova_hooker = require('cordova/src/hooker'),
    Q = require('q'),
    chalk = require('chalk'),
    settings = require('./settings');

function addPlatforms (platforms, verbose) {
    var cwd = process.cwd();

    process.chdir(path.join(cwd, settings.cordovaAppPath));

    var projectRoot = cordova_util.cdProjectRoot(),
        hooks = new cordova_hooker(projectRoot),
        opts = {
            platforms: platforms,
            // android output too much stuff, ignore it for now!
            spawnoutput: {
                stdio: 'ignore'
            }
        };

    return cordova_platform_add(hooks, projectRoot, platforms, opts).then(function (err) {
        process.chdir(cwd);
        if(err) return Q.reject(err);
        if (verbose) {
            platforms.forEach(function (target) {
                console.log(chalk.green('✔') + ' cordova platform ' + target + ' added');
            });
        }
        return platforms;
    });
}

module.exports = {
    add: addPlatforms
};