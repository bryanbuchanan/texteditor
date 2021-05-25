
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser, DOMSerializer } from "prosemirror-model"

import { schema } from "prosemirror-schema-basic"
import { baseKeymap, toggleMark } from "prosemirror-commands"
import { keymap } from "prosemirror-keymap"
import { undo, redo, history } from "prosemirror-history"
import { addListNodes } from "prosemirror-schema-list"

import { menuPlugin } from "./menuPlugin.js"

const Editor = (parameters) => {

	const el = parameters.element

	// Markup changes to accomodate text editor
	el.innerHTML = `<div class="text__content" style="display:none!important;">${el.innerHTML}</div>` // Wrap/hide existing content
	const content = el.querySelector('.text__content')
	const editor = document.createElement('div')
	editor.classList.add('js-editor')
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
			history(),
			keymap(baseKeymap),
			keymap({
				"Shift-Enter": (state, dispatch) =>
					dispatch(
						state.tr
						.replaceSelectionWith(mySchema.nodes.hard_break.create())
						.scrollIntoView()
					),
				"Mod-b": toggleMark(mySchema.marks.strong),
				"Mod-i": toggleMark(mySchema.marks.em),
				"Mod-z": undo,
				"Mod-y": redo,
			}),
			menu,
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

				// TODO something about DOMSerializer breaks everything when creating a list
				console.log(view.state.doc.content)
				try {

					const fragment = DOMSerializer.fromSchema(schema).serializeFragment(view.state.doc.content)
					const html = toHTML(fragment)
					const id = el.dataset.id ?? el.id ?? "About 350"
			
					// Send data to callback function
					parameters.save({
						id: id,
						html: html
					})

				} catch(error) {
					console.log(error)
				}

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

