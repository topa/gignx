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
            copy: {
                command: 'cp ./extension/* ' + installDir,
                options: shellDefaultOptions
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');

    // Default task(s).
    grunt.registerTask('install', ['shell:mkdir', 'shell:copy']);

};