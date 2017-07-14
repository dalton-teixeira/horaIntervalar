# horaIntervalar

It is a excel 365 add-in that calculates horas intervalares.

It is a hands free tool that allows urser to select a range of date and hours then click on Calcular button where is going to calc the total of hourss of each day based on five minutes of limite.

Developement environment has be set up using:
nodeJS
Visual Studio for Office365
http://browserify.org/#install
https://github.com/babel/babelify

Both browserify and babelify are used in order to parse the node code to client side code. It is necessary in order to run the application on browser.

In general you may develop it as nodeJS application and afterwards you just have to build using browserify/babelify by this command:

browserify Home.js -o bundle.js -t [ babelify --presets [ es2015 ] ]

In order to build the application as es2015 you have to install the preset es2015 before: http://babeljs.io/docs/plugins/preset-es2015/

