module.exports = function(grunt) {

    var metadata = grunt.file.readJSON('extension/metadata.json'),
        installDir = '~/.local/share/gnome-shell/extensions/' + metadata.uuid + '/',
        shellDefaultOptions = { stdout: true };

    // Project configuration.
    grunt.initConfig({
        shell: {
            mkdir: {
                command: 'mkdir ' + installDir,
                options: shellDefaultOptions
            },
            compileSchema: {
                command: 'glib-compile-schemas extension/schemas/',
                options: shellDefaultOptions
            },
            copy: {
                command: 'cp -r ./extension/* ' + installDir,
                options: shellDefaultOptions
            }
        }         ,
        jasmine_node: {

        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-jasmine-node');

    // Default task(s).
    grunt.registerTask('install', ['shell:mkdir', 'shell:compileSchema', 'shell:copy']);

    grunt.registerTask('test', ['jasmine_node']);

};