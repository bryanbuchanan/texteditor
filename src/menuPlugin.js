import { Plugin } from "prosemirror-state";
import { toggleMark } from "prosemirror-commands";
import {
	stringToDom,
	generalActiveCheck,
	insertAtEnd,
	linkHandler,
	toggleBlockType,
	toggleWrapIn,
	setupInputListeners,
} from "./pluginUtils";

class MenuView {

	constructor(items, editorView) {

		this.items = items;
		this.editorView = editorView

		this.dom = document.createElement('div');
		this.dom.className = "texteditor__menu";
		const schema = editorView.state.schema;

		// Build link input prompt
		let container = document.createElement('div');
		container.innerHTML = '<div class="texteditor__link"><input class="texteditor__linkinput" type="text" placeholder="Enter an address..."><div class="texteditor__linkclose">x</div></div>';
		let linkPrompt = container.querySelector("*");
		const input = container.querySelector("input");
		const inputCloseBtn = container.querySelector(".texteditor__linkclose");
		setupInputListeners(this.editorView, input, inputCloseBtn);
		this.dom.appendChild(linkPrompt);

		// Run conversions on item array
		for (const item of this.items) {

			// Convert strings to dom nodes
			if (typeof item.dom === "string") {
				const container = document.createElement('div');
				container.innerHTML = item.dom;
				item.dom = container.querySelector("*");
			}

			// Convert "type" to actual commands
			if (item.type === "strong") {
				item.command = toggleMark(schema.marks.strong);
				item.checkActive = generalActiveCheck(schema.marks.strong);
			} else if (item.type === "em") {
				item.command = toggleMark(schema.marks.em);
				item.checkActive = generalActiveCheck(schema.marks.em);
			} else if (item.type === "h2") {
				item.command = toggleBlockType(editorView, "heading", {
					level: 2,
				});
				item.checkActive = generalActiveCheck(schema.nodes.heading, {
					level: 2,
				});
			} else if (item.type === "h3") {
				item.command = toggleBlockType(editorView, "heading", {
					level: 3,
				});
				item.checkActive = generalActiveCheck(schema.nodes.heading, {
					level: 3,
				});
			} else if (item.type === "link") {
				item.command = linkHandler(editorView);
				item.checkActive = generalActiveCheck(schema.marks.link);
			} else if (item.type === "blockquote") {
				item.command = toggleWrapIn(editorView, "blockquote");
				item.checkActive = generalActiveCheck(schema.nodes.blockquote);
			} else if (item.type === "hr") {
				item.command = insertAtEnd(editorView, "horizontal_rule");
			} else if (item.type === "ul") {
				item.command = toggleWrapIn(editorView, "bullet_list");
				item.checkActive = generalActiveCheck(schema.nodes.bullet_list);
			} else if (item.type === "ol") {
				item.command = toggleWrapIn(editorView, "ordered_list");
				item.checkActive = generalActiveCheck(schema.nodes.ordered_list);
			} 
		};

		// Append to container
		for (const item of this.items) {
			// Wrap button
			item.dom = stringToDom(`<div title="${item.title}" class="texteditor__button texteditor__button--${item.type} js-${item.type}">${item.icon}</div>`)
			// Append to menu
			this.dom.appendChild(item.dom)
		}

		// Update
		this.update(editorView, null);

		// Assign commands
		this.dom.addEventListener('mousedown', e => {
			e.preventDefault();
			if (!e.target.className.includes('texteditor__linkinput')) {
				editorView.focus();
			}
			items.forEach(({ command, dom }) => {
				if (typeof command === "function") {
					if (dom.contains(e.target)) {
						command(editorView.state, editorView.dispatch, editorView);
					}
				}
			});
		});
	}

	update(view, prevState) {

		// Set menu buttons to 'active', if current selection matches the command the button would assign
		this.items.forEach(({ dom, checkActive }) => {
			if (checkActive && checkActive(this.editorView.state)) {
				dom.classList.add('active');
			} else {
				dom.classList.remove('active');
			}
		});

		let menu = view.dom.parentNode.querySelector('.texteditor__menu')

		if (menu) {

			// Show/hide menu
			if (this.editorView.state.selection.empty) {
				menu.classList.remove("active");
				menu.classList.remove("link");
			} else {
				menu.classList.add("active");
			}

			// Reposition menu, if selection changed
			if (this.editorView.state.selection.from !== prevState.selection.from
			|| this.editorView.state.selection.to !== prevState.selection.to) {

				// Get selection coordinates
				let { from, to } = this.editorView.state.selection;
				let start = this.editorView.coordsAtPos(from);
				let end = this.editorView.coordsAtPos(to);

				if (menu.offsetParent) {

					let box = menu.offsetParent.getBoundingClientRect()
					let menuDimensions = menu.getBoundingClientRect()

					// horizontal alignment
					let left = ((start.left + end.left) / 2) - box.x
					left = left - (menu.offsetWidth / 2)
					if (left < -box.left) {
						left = 0
					} else if (left + menu.offsetWidth > box.width) {
						left = box.width - menu.offsetWidth
					}
					menu.style.left = left + "px"

					// Vertical alignment
					let top = start.top - box.top - menuDimensions.height
					if (top < -box.top) {
						top = start.top + 40
					}
					menu.style.top = top + "px"

				}

			}

		}
	}

	destroy() {
		this.dom.remove();
	}

}

export function menuPlugin(items) {
	return new Plugin({
		view(editorView) {
			let menuView = new MenuView(items, editorView);
			editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom);
			return menuView;
		},
		props: {
			handleDOMEvents: {
				focus: (view, event) => {
					view.wasFocused = true;
					return false;
				},
				blur: (view, event) => { 

					if (view.wasFocused) {

						let container = event.target.parentNode
						
						// handle linkinput
						const linkInput = view.dom.parentNode.querySelector('.texteditor__menu')
						// const linkInput = document.querySelector('.texteditor__menu')
						const linkInputActive = [...linkInput.classList].includes('link')
						if (!linkInputActive) {
							container
								.querySelector('.texteditor__menu')
								.classList.remove('active')
						}
					}
					return false

				},
			},
		},
		appendTransaction(transaction, oldState, newState) { },
	});
}