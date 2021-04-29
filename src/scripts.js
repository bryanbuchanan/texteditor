import {EditorState} from "prosemirror-state" // Required
import {EditorView} from "prosemirror-view" // Required
import {Schema, DOMParser, DOMSerializer} from "prosemirror-model" // Required
import {schema} from "prosemirror-schema-basic"

import {menuPlugin} from "./menuPlugin.js"

// Get all elements that should contain an editor
let texts = document.querySelectorAll('.text');

// Loop through each one
for (let text of texts) {
		
	let content = text.querySelector('.content');
	let editor = text.querySelector('.editor');
	
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
			command: 'em',
			dom: '<div title="Italic" class="textmenu__button textmenu__button--italic js-italic"><i class="fal fa-italic"></i></div>',
		},
	]);
	
	// Define state
	let state = EditorState.create({
		doc: DOMParser.fromSchema(schema).parse(content),
		plugins: [
			menu
		]
	});
	
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
	});

}







