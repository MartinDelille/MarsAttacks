module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodemon: {
      dev: {
        script: 'server/server.js',
        options: {
          ext: 'js,html',
        },
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');

}
