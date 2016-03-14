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
                  'MaterialIcons-Regular.eot': 'material-design-icons/iconfont/MaterialIcons-Regular.eot',
                  'MaterialIcons-Regular.woff': 'material-design-icons/iconfont/MaterialIcons-Regular.woff',
                  'MaterialIcons-Regular.woff2': 'material-design-icons/iconfont/MaterialIcons-Regular.woff2',
                  'MaterialIcons-Regular.truetype': 'material-design-icons/iconfont/MaterialIcons-Regular.ttf'
                }
            },
        }
    });

    // load the plugin that provides the bowercopy command
    grunt.loadNpmTasks('grunt-bowercopy');

    // default tasks
    grunt.registerTask('default', ['bowercopy']);
};
