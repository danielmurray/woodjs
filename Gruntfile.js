module.exports = function (grunt) {
    grunt.initConfig({
        bowercopy: {
            options: {
                srcPrefix: 'bower_components'
            },
            // font components
            fonts: {
                options: {
                    destPrefix: 'dist/fonts'
                },
                files: {
                }
            },
        }
    });

    // load the plugin that provides the bowercopy command
    grunt.loadNpmTasks('grunt-bowercopy');

    // default tasks
    grunt.registerTask('default', ['bowercopy']);
};
