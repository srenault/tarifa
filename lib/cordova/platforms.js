var path = require('path'),
    os = require('os'),
    fs = require('q-io/fs'),
    cordova_platform_add = require('cordova-lib/src/cordova/platform').add,
    cordova_platform_remove = require('cordova-lib/src/cordova/platform').remove,
    cordova_platform_update = require('cordova-lib/src/cordova/platform').update,
    cordova_util = require('cordova-lib/src/cordova/util'),
    cordova_hooker = require('cordova-lib/src/hooks/HooksRunner'),
    cordova_check = require('./check'),
    Q = require('q'),
    chalk = require('chalk'),
    print = require('../helper/print'),
    os = require('os'),
    settings = require('../settings');

function copyGradleBuildFile(cordovaRoot) {
    var buildGradlePath = path.resolve(cordovaRoot, 'platforms', 'android', 'build.gradle');

    return fs.remove(buildGradlePath).then(function () {
        return fs.copy(path.resolve(__dirname, 'build.gradle'), buildGradlePath);
    });
}

function addPlatforms (root, platforms, verbose) {
    var cwd = process.cwd();

    process.chdir(path.resolve(root, settings.cordovaAppPath));

    var cordovaRoot = cordova_util.cdProjectRoot(),
        hooks = new cordova_hooker(cordovaRoot),
        opts = {
            platforms: platforms,
            spawnoutput: {
                stdio: 'ignore'
            }
        };

    return cordova_platform_add(hooks, cordovaRoot, platforms, opts).then(function () {
        process.chdir(cwd);
        if (platforms.indexOf('android') > -1) return copyGradleBuildFile(cordovaRoot);
    }).then(function () {
        if (verbose) {
            platforms.forEach(function (target) {
                print.success('cordova platform %s added', target);
            });
        }
        return platforms;
    });
}

function updatePlatforms (root, platforms) {
    var cwd = process.cwd();

    process.chdir(path.resolve(root, settings.cordovaAppPath));

    var cordovaRoot = cordova_util.cdProjectRoot(),
        hooks = new cordova_hooker(cordovaRoot),
        opts = {
            platforms: platforms,
            spawnoutput: {
                stdio: 'ignore'
            }
        };

    return cordova_platform_update(hooks, cordovaRoot, platforms, opts).then(function () {
        process.chdir(cwd);
    }).then(function () { return platforms; });
}

function removePlatforms (root, platforms, verbose) {
    var cwd = process.cwd();

    process.chdir(path.resolve(root, settings.cordovaAppPath));

    var cordovaRoot = cordova_util.cdProjectRoot(),
    hooks = new cordova_hooker(cordovaRoot),
    opts = {
        platforms: platforms,
        spawnoutput: {
            stdio: 'ignore'
        }
    };

    return cordova_platform_remove(hooks, cordovaRoot, platforms, opts).then(function () {
        process.chdir(cwd);
        if (verbose) {
            platforms.forEach(function (target) {
                print.success('cordova platform %s removed', target);
            });
        }
        return platforms;
    });
}

function listPlatforms(root, verbose) {
    var cwd = process.cwd();

    process.chdir(path.resolve(root, settings.cordovaAppPath));

    var projectRoot = cordova_util.cdProjectRoot(),
    platforms_on_fs = cordova_util.listPlatforms(projectRoot);

    return Q.resolve(platforms_on_fs).then(function(platforms) {
        if (verbose) {
            print(chalk.green(platforms.join('\n')));
        }
        process.chdir(cwd);
        return platforms;
    });
}

var isAvailableOnHostSync = function(platform) {
    return settings.os_platforms[platform] && settings.os_platforms[platform].indexOf(os.platform()) > -1;
};

var isAvailableOnHost = function (platform) {
    if(!settings.os_platforms[platform]) return Q.reject("platform name does not exist");
    return isAvailableOnHostSync(platform) ? Q.resolve(true) : Q.reject("platform not available on your os");
};

var installedPlatforms = function (verbose) {
    return settings.platforms.filter(function (p) {
        return settings.os_platforms[p].indexOf(os.platform()) > -1;
    }).reduce(function (rslt, item) {
        return rslt.then(function (r) {
            return cordova_check(item).then(function () {
                r.push({ name : item, value : item });
                return r;
            }, function (err) {
                if(verbose) print.error("platform %s %s", item, err);
                r.push({ name : item, value : item, disabled: true });
                return r;
            });
        });
    }, Q.resolve([]));
};

module.exports = {
    add: addPlatforms,
    remove: removePlatforms,
    update : updatePlatforms,
    list: listPlatforms,
    isAvailableOnHost: isAvailableOnHost,
    isAvailableOnHostSync: isAvailableOnHostSync,
    installedPlatforms: installedPlatforms
};
