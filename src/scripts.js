import {EditorState} from "prosemirror-state" // Required
import {EditorView} from "prosemirror-view" // Required
import {Schema, DOMParser, DOMSerializer} from "prosemirror-model" // Required
import {schema} from "prosemirror-schema-basic"
import {baseKeymap, toggleMark} from "prosemirror-commands"
import {keymap} from "prosemirror-keymap"
import {undo, redo, history} from "prosemirror-history"

import {menuPlugin} from "./menuPlugin.js"

// Get all elements that should contain an editor
let texts = document.querySelectorAll('.text')

// Loop through each one
for (let text of texts) {
		
	let content = text.querySelector('.content')
	let editor = text.querySelector('.editor')
	
	// Create instance of menu plugin
	let menu = menuPlugin([
		{
			command: 'strong',
			dom: '<div title="Bold" class="textmenu__button textmenu__button--bold js-bold"><i class="fas fa-bold"></i></div>',
		},
		{
			command: 'em',
			dom: '<div title="Italic" class="textmenu__button textmenu__button--italic js-italic"><i class="fal fa-italic"></i></div>',
		},
		{
			command: 'link',
			dom: '<div title="Link" class="textmenu__button textmenu__button--link js-link"><i class="fal fa-link"></i></div>',
		},
		{
			command: false,
			dom: '<div class="textmenu__divider"></div>'
		},
		{
			command: 'h2',
			dom: '<div title="Big Heading" class="textmenu__button textmenu__button--heading2 js-heading2"><i class="fal fa-heading"></i></div>'
		},
		{
			command: 'h3',
			dom: '<div title="Small Heading" class="textmenu__button textmenu__button--heading3 js-heading3"><i class="fal fa-heading"></i></div>'	
		},
		{
			command: null,
			dom: '<div class="textmenu__divider"></div>'
		},
		{
			command: null,
			dom: '<div title="Bullet List" class="textmenu__button textmenu__button--list js-list"><i class="fal fa-list"></i></div>'
		},
		{
			command: null,
			dom: '<div title="Numbered List" class="textmenu__button textmenu__button--numberedlist js-numberedlist"><i class="fal fa-list-ol"></i></div>'
		},
		{
			command: 'blockquote',
			dom: '<div title="Quote" class="textmenu__button textmenu__button--quote js-quote"><i class="fal fa-quote-left"></i></div>'
		}
	
	])
	
	// Define state
	let state = EditorState.create({
		doc: DOMParser.fromSchema(schema).parse(content),
		plugins: [
			keymap(baseKeymap),
			keymap({
				"Shift-Enter": schema.nodes.hard_break.create(), // WOrks but causes error
				"Mod-b": toggleMark(schema.marks.strong),
				"Mod-i": toggleMark(schema.marks.em),
				"Mod-z": undo,
				"Mod-y": redo
			}),
			
			menu,
		]
	})
	
	// Define view
	let view = new EditorView(editor, {
		state,
		dispatchTransaction(transaction) {
			
			// Update editor state
			let previousState = view.state.doc;
			let newState = view.state.apply(transaction);
			view.updateState(newState);
				
			// Save content
			if (!previousState.eq(view.state.doc)) { }
			
		},
		handleDOMEvents: {}
	})

}







