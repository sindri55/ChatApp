module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      foo: {
        src: [
          "src/js/*.js",
          "src/js/services/*.js",
          "src/js/directives/*.js",
          "src/js/controllers/*.js",
        ],
      },
    },
    /*
       The task to concatenate and minify the code has been removed
       You have to figure that one out yourself :)

       And since the index is referencing the file from that task
       it wont receive your updates until you figure this task out
       or reference the original src/ files
    */
   
  concat:{
      dist: {
        src: [
          'src/js/controllers/*.js',
          'src/js/*.js',
          'src/js/services/*.js',
          'src/js/controllers/login.js',
          'src/js/controllers/room.js',
          'src/js/controllers/menu.js',
          'src/js/services/socket.js'
          

          //'src/js/controllers/socket.js',
          //'src/js/controllers/app.js',
          //'build/chatapp.min.js'
        ],
        dest: 'src/build/chatapp.js',
      }
    },

   // uglify: {
   //    build: {
   //      src:'src/build/chatapp.js',
   //      dest: 'src/build/chatapp.min.js'
   //    }
   //  },


    // tekur ekki ennþá inn myndir frá dest
    // imagemin: {
    //   dynamic: {
    //     files: [{
    //       expand: true,
    //       cwd: 'images/',
    //       src: ['**/*.{png, jpg,gif}'],
    //       dest: 'images/build/'
    //     }]
    //   }
    // },

    connect:{
      server:{ 
       options: {
        port: 8081,
        keepalive: true,
        livereload: false,
        open: true


        }
      }
    },

// Spots a change in js
   /* watch: {
      scripts: {
        files:  ['src/controllers/*.js'],
                ['src/directives/*.js'],
                ['src/app/*.js'],
        tasks:['concat', 'uglify'],
        options:{
          spawn: false,
        },
      }
    }
*/





  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'connect']);
};