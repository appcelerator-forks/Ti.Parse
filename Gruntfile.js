/**
 * Gruntfile for packaging the Titanium Module
 *
 * for Titaniumfier, please refer
 * https://github.com/smclab/titaniumifier
 *
 * for the submodules mechanism, please refer
 * http://emanuele.decup.is/articles/reuse-code-alloy-custom/
 *
 * for the original commonjs code, please refer
 * https://github.com/TheRyanHickman/Ti.Parse/
 *
 * @author  Emanuele De Cupis
 * http://emanuele.decup.is
 */
module.exports = function(grunt) {

    // you'll need these modules for correctly addressing folders and files
    var path = require('path');
    var fs = require('fs');

    //root for our submodules
    var submodules = path.join(__dirname, 'submodules');
    var originalRepo = path.join(submodules, 'Ti.Parse');


    // Project configuration.
    grunt.initConfig({
        titaniumifier: {
            "module": {
                files: {
                    './dist': '.'
                },
                options: {}
            }
        },

        gitcheckout: {
            originalRepo: {
                options: {
                    cwd: originalRepo,
                    verbose: true,
                    branch: '.'
                }
            }
        },
        gitpull: {
            originalRepo: {
                options: {
                    cwd: originalRepo,
                    verbose: true,
                    callback: function(done) {
                        mergeFilesFromOriginal();
                        done();
                    }
                }
            }
        }

    });



    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-titaniumifier');

    // Default task(s).
    grunt.registerTask('build', ['gitcheckout', 'gitpull', 'titaniumifier']);


    function mergeFilesFromOriginal() {

        //just move the original ti.parse.js file 

        var file = path.join(originalRepo, 'ti.parse.js');
        var source = file;
        var destination = path.join('./', 'index.js');
        copyFile(source, destination);
    }

    /**
     * Simple routine to copy files in js
     * @param  {string} srcFile   path for source file
     * @param  {string} destFile  path for destination file
     * @return {object}           reference to the created file
     */
    function copyFile(srcFile, destFile) {
        console.log('copying ' + srcFile + ' into ' + destFile);
        var BUF_LENGTH, buff, bytesRead, fdr, fdw, pos;
        BUF_LENGTH = 64 * 1024;
        buff = ''; // new Buffer(BUF_LENGTH);
        fdr = fs.readFileSync(srcFile);
        fdw = fs.writeFileSync(destFile, fdr);
        return fdw;
    };

};