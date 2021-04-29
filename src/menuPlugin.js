import {Plugin} from "prosemirror-state"
import {toggleMark, setBlockType, wrapIn} from "prosemirror-commands"
import {schema} from "prosemirror-schema-basic"

class MenuView {
	
	constructor(items, editorView) {
	
		this.items = items
		this.editorView = editorView
		
		this.dom = document.createElement('div')
		this.dom.className = "textmenu js-textmenu"
		
		// Run coversions on item array
		items.forEach(function(item, index) {
			// Convert strings to dom nodes
			if (typeof item.dom === "string") {
				let container = document.createElement('div')
				container.innerHTML = item.dom
				items[index].dom = container.querySelector('*')
			}
			// Convert command shorthand
			if (item.command === "strong") {
				items[index].command = toggleMark(schema.marks.strong)
			} else if (item.command === "em") {
				items[index].command = toggleMark(schema.marks.em)
			}
		})
		
		// Append to container
		items.forEach(({dom}) => this.dom.appendChild(dom))
		
		// Update
		this.update(editorView, null)
		
		// Assign commands
		this.dom.addEventListener('mousedown', e => {
			e.preventDefault()
			editorView.focus()
			items.forEach(({command, dom}) => {
				if (dom.contains(e.target)) command(editorView.state, editorView.dispatch, editorView)
			})
		})
	
	}
	
	update() {
		
		// Set current styling to active
		this.items.forEach(({command, dom}) => {
			let active = command(this.editorView.state, null, this.editorView)
			if (dom.style.display == active) {
				dom.classList.remove('active')
			} else {
				dom.classList.add('active')
			}
		});
				
		let menu = this.editorView.dom.closest('.editor').querySelector('.js-textmenu')
		
		if (menu) {
		
			// Show/hide menu
			if (this.editorView.state.selection.empty) {
				menu.classList.remove('active')
			} else {
				menu.classList.add('active')
			}
			
			// Position menu
			let {from, to} = this.editorView.state.selection
			let start = this.editorView.coordsAtPos(from), end = this.editorView.coordsAtPos(to)
			if (menu.offsetParent) {
				let box = menu.offsetParent.getBoundingClientRect()
				let left = (start.left + end.left) / 2
				menu.style.left = left + "px"
				menu.style.top = start.top - 60 + "px"		
			}
		
		}
		
	}
	
	destroy() { this.dom.remove() }
	
}

export function menuPlugin(items) {
	return new Plugin({
		view(editorView) {
			let menuView = new MenuView(items, editorView)
			editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom)
			return menuView
		},
		props: {
			handleDOMEvents: {
				focus: (view, event) => {
					view.wasFocused = true;
					return false;
				},
				blur: (view, event) => {
					if (view.wasFocused) {
						let container = event.target.closest('.editor')
						container.classList.remove('focused')
						container.querySelector('.js-textmenu').classList.remove('active')
					}
					return false
				}
			}
		},
		appendTransaction(transaction, oldState, newState) { }
	})
}