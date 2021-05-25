
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser } from "prosemirror-model"

import { schema } from "prosemirror-schema-basic"
import { baseKeymap } from "prosemirror-commands"
import { keymap } from "prosemirror-keymap"
import { history } from "prosemirror-history"
import { addListNodes } from "prosemirror-schema-list"

import { buildInputRules } from "./inputrules"
import { buildKeymap } from "./keymap"

import { menuPlugin } from "./menuPlugin.js"

const Editor = (parameters) => {

	const el = parameters.element

	// Markup changes to accomodate text editor
	el.innerHTML = `<div class="texteditor__content" style="display:none!important;">${el.innerHTML}</div>` // Wrap/hide existing content
	const content = el.querySelector('.texteditor__content')
	const editor = document.createElement('div')
	editor.classList.add('texteditor')
	el.append(editor)

    // Create instance of menu plugin
    const menu = new menuPlugin(parameters.menu)

    const mySchema = new Schema({
    	nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    	marks: schema.spec.marks,
    })

    // Define state
    const state = EditorState.create({
    	doc: DOMParser.fromSchema(mySchema).parse(content),
    	plugins: [
			menu,
			buildInputRules(mySchema),
			history(),
			keymap(buildKeymap(mySchema)),
			keymap(baseKeymap),

			// keymap({
			// 	"Mod-z": undo,
			// 	"Mod-y": redo,
			// }),

			// keymap({
			// 	"Shift-Enter": (state, dispatch) =>
			// 		dispatch(
			// 			state.tr
			// 			.replaceSelectionWith(mySchema.nodes.hard_break.create())
			// 			.scrollIntoView()
			// 		),
			// 	"Mod-b": toggleMark(mySchema.marks.strong),
			// 	"Mod-i": toggleMark(mySchema.marks.em),
			// 	"Mod-z": undo,
			// 	"Mod-y": redo,
			// }),
		],
    })

    // Define view
    let view = new EditorView(editor, {
		state,
		dispatchTransaction(transaction) {

			// Update editor state
			let previousState = view.state.doc
			let newState = view.state.apply(transaction)
			view.updateState(newState)

			// Save content
			if (!previousState.eq(view.state.doc)) {

				const html = view.dom.innerHTML
				const id = el.dataset.id ?? el.id ?? "About 350"
		
				// Send data to callback function
				parameters.change({
					id: id,
					html: html
				})

			}
    	},
    	handleDOMEvents: {}, 
    })

}

const toHTML = (string) => {
	const div = document.createElement('div')
	div.appendChild(string)
	return div.innerHTML
}

export default Editor

