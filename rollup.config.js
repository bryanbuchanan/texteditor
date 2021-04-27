import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const dev = process.env.ROLLUP_WATCH;

export default [
	{
		input: './src/scripts.js',
		output: {
			file: './dist/scripts.js',
			format: 'iife',
			sourcemap: true
		},
		plugins: [
			resolve(),
			commonjs(),
			dev && serve(),
			dev && livereload({
				watch: './dist'
			})
		]	
	},
	{
		input: './src/styles.scss',
		output: {
			file: './dist/styles.css'
		},
		plugins: [
			postcss({
				extract: true,
				minimize: false,
				sourceMap: true
			})
		]
	}
];
