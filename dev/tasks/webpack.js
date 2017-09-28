/* jshint node: true */

'use strict';

var path = require( 'path' ),
	MinifyPlugin = require( 'babel-minify-webpack-plugin' );

module.exports = function( grunt ) {
	grunt.config.merge( {
		webpack: {
			all: function() {
				return {
					entry: path.join( __dirname, 'utils', 'cs-build-entry.js' ),

					output: {
						filename: 'cs.js',
						path: path.join( __dirname, '..', '..', 'plugins', 'easyimage', 'lib' ),
						libraryTarget: 'var',
						library: ''
					},

					module: {
						rules: [
							{
								test: /\.js$/,
								loader: 'babel-loader',
								query: {
									cacheDirectory: true,
									presets: [
										require( 'babel-preset-es2015' )
									]
								}
							}
						]
					},

					plugins: [
						new MinifyPlugin( null, {
							comments: false
						} )
					]
				};
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-webpack' );
};