import {EditorState, Plugin} from "prosemirror-state"; // Required
import {EditorView} from "prosemirror-view"; // Required
import {Schema, DOMParser, DOMSerializer} from "prosemirror-model"; // Required

import {schema} from "prosemirror-schema-basic";
import {toggleMark, setBlockType, wrapIn, baseKeymap} from "prosemirror-commands";
import {keymap} from "prosemirror-keymap";

import {undo, redo, history} from "prosemirror-history";
import {wrapInList, splitListItem, liftListItem, sinkListItem} from "prosemirror-schema-list";

class MenuView {
	
	constructor(items, editorView) {
	
		this.items = items;
		this.editorView = editorView;
		
		// Get menu template from template bank
		let container = document.createElement('div');
		container.innerHTML = `<div class="textmenu js-textmenu">
		
		<div title="Bold" class="textmenu__button textmenu__button--bold js-bold"><i class="fas fa-bold"></i></div>
		<div title="Italic" class="textmenu__button textmenu__button--italic js-italic"><i class="fal fa-italic"></i></div>
		<div title="Link" class="textmenu__button textmenu__button--link js-link"><i class="fal fa-link"></i></div>
		
		<div class="textmenu__divider"></div>
		
		<div title="Heading 1" class="textmenu__button textmenu__button--heading1 js-heading1"><i class="fal fa-heading"></i></div>
		<div title="Heading 2" class="textmenu__button textmenu__button--heading2 js-heading2"><i class="fal fa-heading"></i></div>
		
		<div class="textmenu__divider"></div>
		
		<div title="Bullet List" class="textmenu__button textmenu__button--list js-list"><i class="fal fa-list"></i></div>
		<div title="Numbered List" class="textmenu__button textmenu__button--numberedlist js-numberedlist"><i class="fal fa-list-ol"></i></div>
		<div title="Quote" class="textmenu__button textmenu__button--quote js-quote"><i class="fal fa-quote-left"></i></div>
	
	</div>`;
		this.dom = container.querySelector('*');
	
		this.dom.addEventListener('mousedown', e => {
	
			e.preventDefault();
			editorView.focus();
	
			let level;
			let container = editorView.dom.closest('.js-editor');
			const { $from, $to } = editorView.state.selection;
			const currentBlock = $from.parent;
						
			if (container.querySelector('.js-bold').contains(e.target)) {
			
				toggleMark(schema.marks.strong)(editorView.state, editorView.dispatch, editorView);
			
			} else if (container.querySelector('.js-italic').contains(e.target)) {
			
				toggleMark(schema.marks.em)(editorView.state, editorView.dispatch, editorView);
			
			} else if (container.querySelector('.js-heading1').contains(e.target)) {
				
				level = 2;
				if (currentBlock.type !== editorView.state.schema.nodes.heading || currentBlock.attrs['level'] !== level) {
					setBlockType(schema.nodes.heading, { level: level })(editorView.state, editorView.dispatch, editorView);
				} else {
					setBlockType(schema.nodes.paragraph)(editorView.state, editorView.dispatch, editorView);
				}
				
			} else if (container.querySelector('.js-heading2').contains(e.target)) { 
				
				level = 3;
				if (currentBlock.type !== editorView.state.schema.nodes.heading || currentBlock.attrs['level'] !== level) {
					setBlockType(schema.nodes.heading, { level: level })(editorView.state, editorView.dispatch, editorView);
				} else {
					setBlockType(schema.nodes.paragraph)(editorView.state, editorView.dispatch, editorView);
				}
				
			} else if (container.querySelector('.js-list').contains(e.target)) { 
				
				// if (currentBlock.type !== editorView.state.schema.nodes.heading || currentBlock.attrs['level'] !== level) {
				// 	setBlockType(schema.nodes.heading, { level: level })(editorView.state, editorView.dispatch, editorView);
				// } else {
				// 	setBlockType(schema.nodes.paragraph)(editorView.state, editorView.dispatch, editorView);
				// }
				// 				
				// nodeType = schema.nodes.bullet_list,
				// 
				// 
				// 
				// function wrapListItem(nodeType, options) {
				//   return cmdItem(wrapInList(nodeType, options.attrs), options)
				// }
				// 
				// wrapListItem(type, {
				//   title: "Wrap in bullet list",
				//   icon: icons.bulletList
				// });
				
			} else if (container.querySelector('.js-quote').contains(e.target)) { 
				log('quote!');
				// if (currentBlock.type !== editorView.state.schema.nodes.blockquote) {
				// 	wrapIn(schema.nodes.blockquote)(editorView.state, editorView.dispatch, editorView);
				// } else {
				// 	let { tr } = editorView.state;
				// 	lift(schema.nodes.paragraph)(editorView.state, editorView.dispatch, editorView);
				// }
					
			}
			
			
		
		});
	}
	
	// update() {
	// 	this.items.forEach(({command, dom}) => {
	// 		let active = command(this.editorView.state, null, this.editorView);
	// 		if (dom.style.display = active) {
	// 			dom.classList.remove('actove');
	// 		} else {
	// 			dom.classList.add('active');
	// 		}
	// 	});
	// }
	
	destroy() { this.dom.remove(); }
	
}

// Get all elements that should contain an editor
let texts = document.querySelectorAll('.js-text');

// Loop through each one
for (let text of texts) {
		
	let content = text.querySelector('.js-content');
	let editor = text.querySelector('.js-editor');
	
	let menu = menuPlugin();
	
	let state = EditorState.create({
		doc: DOMParser.fromSchema(schema).parse(content),
		// plugins: exampleSetup({ schema: schema })
		plugins: [
			keymap({
				"Mod-z": undo,
				"Mod-y": redo,
				"Mod-b": toggleMark(schema.marks.strong),
				"Mod-i": toggleMark(schema.marks.em),
				"Shift-Enter": schema.nodes.hard_break.create()
			}),
			keymap(baseKeymap),
			history(),
			menu
		]
	});
	
	let view = new EditorView(editor, {
		state,
		dispatchTransaction(transaction) {
			
			// Update editor state
			let previousState = view.state.doc;
			let newState = view.state.apply(transaction);
			view.updateState(newState);
			
			// Save content
			if (!previousState.eq(view.state.doc)) { }
			
			let menu = view.dom.closest('.js-editor').querySelector('.js-textmenu');
			
			if (view.state.selection.empty) {
				menu.classList.remove('active');
			} else {
				menu.classList.add('active');
			}
			
			let {from, to} = view.state.selection;
			let start = view.coordsAtPos(from), end = view.coordsAtPos(to);
			
			if (menu.offsetParent) {
				
				console.log(start.left, end.left);
			
				let box = menu.offsetParent.getBoundingClientRect();
				// let left = Math.max((start.left + end.left) / 2, start.left + 3);
				let left = (start.left + end.left) / 2;
				// left = left - (menu.offsetWidth / 2);
							
				menu.style.left = left + "px";
				menu.style.top = start.top - 60 + "px";
				// menu.style.bottom = (box.bottom - start.top + 10) + "px";
				
			}
			
		},
		handleDOMEvents: {
			focus: (view, event) => {
				let container = event.target.closest('.js-editor');
				view.wasFocused = true;
				container.classList.add('focused');
				// let id = event.target.closest('section').dataset.id;
				// tta.widgets.edit(id);
				return false;
			},
			blur: (view, event) => {
				if (view.wasFocused) {
					let container = event.target.closest('.js-editor');
					container.classList.remove('focused');
					container.querySelector('.js-textmenu').classList.remove('active');
				}
				return false;
			}
		}
	});

}

function menuPlugin(items) {
	return new Plugin({
		view(editorView) {
			let menuView = new MenuView(items, editorView);
			editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom);
			return menuView;
		}
	})
}






