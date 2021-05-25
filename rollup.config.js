import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'

const dev = process.env.ROLLUP_WATCH;

export default [
	{
		input: './src/editor.js',
		output: {
			file: './dist/editor.js',
			format: 'esm',
			sourcemap: false,
			// plugins: [!dev && terser()]
		},
		plugins: [
			resolve(),
			commonjs(),
			dev && serve(),
			dev && livereload({
				watch: './'
			})
		]	
	},
	{
		input: './test/styles.scss',
		output: {
			file: './test/styles.css'
		},
		plugins: [
			postcss({
				extract: true,
				minimize: false,
				sourceMap: false
			})
		]
	}
]
