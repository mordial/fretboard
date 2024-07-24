const path = require( 'path' ) 

module.exports = {
    mode: 'production',
    watch: true, 
    entry: './src/main.js',
    output: {
        path: path.resolve( __dirname, 'docs' ),
        filename: './bundle.js',
    }
}