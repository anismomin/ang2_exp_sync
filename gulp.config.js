module.exports = function() {
	var config = {
		dev: './src/',
		
		clientConf: './src/client/tsconfig.json',
		client: './src/client/',
		clientTs: './src/client/**/**/*.ts',
		clientHtml: './src/client/**/*.html',
		clientImages: './src/assets/images/**/*',
		clientScss: './src/assets/scss/**/*.scss',


		serverConf: './src/server/tsconfig.json',
		devServer: './src/server/',
		devServerTs: './src/server/**/*.ts',

		built : './built/',
		builtLibs: './built/client/libs/',
		builtClient: './built/client/',
		images: './built/assets/images/',
		scss: './built/assets/css/',		

		builtServer: './built/server/',

		indexPage: 'src/client/index.html'
		

	};
	
	return config;
}