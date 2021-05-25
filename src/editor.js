
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser, DOMSerializer } from "prosemirror-model"

import { schema } from "prosemirror-schema-basic"
import { baseKeymap, toggleMark } from "prosemirror-commands"
import { keymap } from "prosemirror-keymap"
import { undo, redo, history } from "prosemirror-history"
import { addListNodes } from "prosemirror-schema-list"

import { menuPlugin } from "./menuPlugin.js"

const editor = (parameters) => {

  // Get all elements that should contain an editor
  const texts = document.querySelectorAll(parameters.selector)

  // Loop through each one
  for (const text of texts) {

    const content = text.querySelector(parameters.content)
    const editor = text.querySelector(parameters.editor)

    // Create instance of menu plugin
    const menu = menuPlugin(parameters.menu)

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

				const fragment = DOMSerializer.fromSchema(schema).serializeFragment(view.state.doc.content)
				const div = document.createElement('div')
				div.appendChild(fragment)
				const html = div.innerHTML
				const parentElement = view.dom.closest(parameters.selector)
				const id = parentElement.dataset.id ?? parentElement.id ?? "About 350"
		
				// Send data to callback function
				parameters.save({
					id: id,
					html: html
				})

			}
    	},
    	handleDOMEvents: {}, 
    })
  }

}

export default editor

