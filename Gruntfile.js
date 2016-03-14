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
                  // material icons
                  'MaterialIcons-Regular.eot': 'material-design-iconic-font/dist/fonts/Material-Design-Iconic-Font.eot',
                  'MaterialIcons-Regular.woff': 'material-design-iconic-font/dist/fonts/Material-Design-Iconic-Font.woff',
                  'MaterialIcons-Regular.woff2': 'material-design-iconic-font/dist/fonts/Material-Design-Iconic-Font.woff2',
                  'MaterialIcons-Regular.truetype': 'material-design-iconic-font/dist/fonts/Material-Design-Iconic-Font.ttf'
                }
            },
        }
    });

    // load the plugin that provides the bowercopy command
    grunt.loadNpmTasks('grunt-bowercopy');

    // default tasks
    grunt.registerTask('default', ['bowercopy']);
};
