var should = require('should'),
    Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    tmp = require('tmp'),
    setupHelper = require('../helper/setup'),
    prepareAction = require('../../actions/prepare'),
    buildAction = require('../../actions/build'),
    cleanAction = require('../../actions/clean'),
    pluginAction = require('../../actions/plugin'),
    checkAction = require('../../actions/check'),
    configAction = require('../../actions/config'),
    runAction = require('../../actions/run'),
    platformAction = require('../../actions/platform');

describe('testing tarifa cli on darwin', function() {

    var projectDefer = Q.defer(),
        cwd = process.cwd();

    before('create a empty project', setupHelper(tmp, projectDefer, 'create_response_darwin.json'));

    it('create a project (android & ios)', function () {
        this.timeout(0);
        return projectDefer.promise;
    });

    describe('tarifa prepare', function() {
        it('tarifa prepare browser', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return prepareAction.prepare('browser', 'default', false);
            });
        });

        it('tarifa prepare android stage', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return prepareAction.prepare('android', 'stage', false);
            });
        });

        it('tarifa prepare ios prod', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return prepareAction.prepare('ios', 'prod', false);
            });
        });
    });

    describe('tarifa build', function() {
        it('tarifa build browser', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return buildAction.build('browser', 'default', false, false);
            });
        });

        it('tarifa build android', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return buildAction.build('android', 'default', false, false);
            });
        });

        it('tarifa build ios', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return buildAction.build('ios', 'default', false, false);
            });
        });
    });

    describe('tarifa clean', function() {
        it('clean android', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return cleanAction.clean('android', false);
            });
        });
        it('clean ios', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return cleanAction.clean('ios', false);
            });
        });
    });

    describe('tarifa plugin', function() {
        it('tarifa plugin add ../../fixtures/emptyplugin', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return pluginAction.plugin('add', path.join(__dirname, '../fixtures/emptyplugin'), false);
            });
        });

        it('tarifa plugin list', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return pluginAction.list(false).then(function (rslt) {
                    rslt.indexOf("test.test.test").should.equal(1);
                });
            });
        });

        it('re tarifa plugin add ../fixtures/emptyplugin', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                var p = path.join(__dirname, '../fixtures/emptyplugin');
                return pluginAction.plugin('add', p, false).should.be.rejected;
            });
        });

        it('tarifa plugin remove test.test.test', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return pluginAction.plugin('remove', 'test.test.test');
            });
        });

        it('tarifa plugin add https://github.com/apache/cordova-plugin-vibration.git#r0.3.11', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return pluginAction.plugin('add', 'https://github.com/apache/cordova-plugin-vibration.git#r0.3.11', false).then(function () {
                    return pluginAction.list(false).then(function (rslt) {
                        rslt.indexOf("org.apache.cordova.vibration").should.equal(1);
                    });
                });
            });
        });

    });

    describe('tarifa check', function () {
        it('check android & ios', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return checkAction.check(false);
            });
        });
    });

    describe('tarifa config', function () {
        it('tarifa config icons generate red dev', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return configAction.generateIcons('red', 'dev', false);
            });
        });

        it('tarifa config splashscreens red dev', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return configAction.generateSplashscreens('red', 'dev', false);
            });
        });

        it('tarifa config icons file test.png stage', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return configAction.generateIconsFromFile(path.resolve(__dirname, '..', 'fixtures', 'momo.png'), 'stage', false);
            });
        });

    });

    describe('tarifa run', function () {
        it('tarifa run android dev', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return runAction.run('android', 'dev', false);
            });
        });

        it('tarifa run android stage', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return runAction.run('android', 'stage', false);
            });
        });

        it('tarifa run ios stage', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return runAction.run('ios', 'stage', false);
            });
        });

        it('tarifa run ios dev', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return runAction.run('ios', 'dev', false);
            });
        });

        it('tarifa run browser stage', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return runAction.run('browser', 'stage', false);
            });
        });

        it('tarifa run browser', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return runAction.run('browser', 'default', false);
            });
        });
    });

    describe('tarifa platform', function () {
        it('tarifa platform list', function () {
            this.timeout(0);
            return projectDefer.promise.then(function () {
                return platformAction.list().then(function (rslt) {
                    rslt.indexOf('ios').should.be.above(-1);
                    rslt.indexOf('android').should.be.above(-1);
                });
            });
        });

        it('tarifa platform remove ios', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return platformAction.platform('remove', 'ios', false);
            });
        });

        it('tarifa platform remove android', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return platformAction.platform('remove', 'android', false);
            });
        });

        it('tarifa platform add android', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return platformAction.platform('add', 'android', false);
            });
        });

        it('try to re call tarifa platform add android', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return platformAction.platform('add', 'android', false).should.be.rejected;
            });
        });

    });

});
