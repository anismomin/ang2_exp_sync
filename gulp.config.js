module.exports = function() {
	var config = {
		dev: './src/',
		
		clientConf: './src/client/app/tsconfig.json',
		client: './src/client/',
		clientTs: './src/client/app/**/**/*.ts',
		clientHtml: './src/client/app/**/*.html',
		clientImages: './src/client/assets/images/**/*',
		clientScss: './src/client/assets/scss/**/*.scss',


		serverConf: './src/server/tsconfig.json',
		devServer: './src/server/',
		devServerTs: './src/server/**/*.ts',

		built : './built/',
		builtClient: './built/client/',
		builtLibs: './built/client/libs/',
		builtApp: './built/client/app/',
		images: './built/client/assets/images/',
		scss: './built/client/assets/css/',		

		builtServer: './built/server/',

		indexPage: 'src/client/index.html'
		

	};
	
	return config;
}