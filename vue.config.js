module.exports = {
	publicPath: process.env.NODE_ENV === 'development' ? '/' : process.env.VUE_APP_PUBLICPATH,
	css: {
		extract: {
			filename: 'css/[name].css',
			chunkFilename: 'css/[name].css',
		},
		loaderOptions: {
			scss: {
				prependData: `@import "@/assets/scss/utility/index.scss";`
			},
		}
	},
	configureWebpack: {
		output: {
			filename: 'js/[name].js',
			chunkFilename: 'js/[name].js',
		}
	}
}