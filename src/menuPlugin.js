import { Plugin } from "prosemirror-state";
import { toggleMark } from "prosemirror-commands";
import {
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
		this.editorView = editorView;

		this.dom = document.createElement("div");
		this.dom.className = "textmenu js-textmenu";
		const schema = editorView.state.schema;
		// Build link input prompt
		let container = document.createElement("div");
		container.innerHTML = '<div class="textmenu__link"><input class="textmenu__linkinput" type="text" placeholder="Enter an address..."><div class="textmenu__linkclose">x</div></div>';

		let linkPrompt = container.querySelector("*");
		const input = container.querySelector("input");
		const inputCloseBtn = container.querySelector(".textmenu__linkclose");

		setupInputListeners(this.editorView, input, inputCloseBtn);

		this.dom.appendChild(linkPrompt);

		// Run conversions on item array
		// this.items.forEach((item, index) => {

		for (const item of items) {

			// Convert strings to dom nodes
			if (typeof item.dom === "string") {
				const container = document.createElement('div');
				container.innerHTML = item.dom;
				item.dom = container.querySelector("*");
			}

			// Convert command shorthand
			if (item.command === "strong") {
				item.command = toggleMark(schema.marks.strong);
				item.checkActive = generalActiveCheck(schema.marks.strong);
			} else if (item.command === "em") {
				item.command = toggleMark(schema.marks.em);
				item.checkActive = generalActiveCheck(schema.marks.em);
			} else if (item.command === "h2") {
				item.command = toggleBlockType(editorView, "heading", {
					level: 2,
				});
				item.checkActive = generalActiveCheck(schema.nodes.heading, {
					level: 2,
				});
			} else if (item.command === "h3") {
				item.command = toggleBlockType(editorView, "heading", {
					level: 3,
				});
				item.checkActive = generalActiveCheck(schema.nodes.heading, {
					level: 3,
				});
			} else if (item.command === "link") {
				item.command = linkHandler(editorView);
				item.checkActive = generalActiveCheck(schema.marks.link);
			} else if (item.command === "blockquote") {
				item.command = toggleWrapIn(editorView, "blockquote");
				item.checkActive = generalActiveCheck(schema.nodes.blockquote);
			} else if (item.command === "hr") {
				item.command = insertAtEnd(editorView, "horizontal_rule");
			} else if (item.command === "ul") {
				item.command = toggleWrapIn(editorView, "bullet_list");
				item.checkActive = generalActiveCheck(schema.nodes.bullet_list);
			} else if (item.command === "ol") {
				item.command = toggleWrapIn(editorView, "ordered_list");
				item.checkActive = generalActiveCheck(schema.nodes.ordered_list);
			} 
		};

		// Append to container
		// items.forEach(({ dom }) => this.dom.appendChild(dom));

		for (const item of this.items) {
			console.log(this.dom)
			console.log(item.dom)
			this.dom.appendChild(item.dom)
		}

		// Update
		this.update(editorView, null);
		// this.update() 

		// Assign commands
		this.dom.addEventListener("mousedown", e => {
			e.preventDefault();
			if (!e.target.className.includes('textmenu__linkinput')) {
				editorView.focus();
			}
			items.forEach(({ command, dom }) => {
				if (typeof command == "function") {
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

		let menu = this.editorView.dom.closest('.editor').querySelector('.js-textmenu');

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

					console.log('box', box)
					console.log('menuDimensions', menuDimensions)
					
					let left = ((start.left + end.left) / 2) - box.x
					left = left - (menu.offsetWidth / 2)
					if (left < 0) left = 0

					menu.style.left = left + "px"

					// menu.style.bottom = (box.bottom - start.bottom + menuDimensions.height) + "px"

					let top = start.top - box.top - menuDimensions.height
					console.log('top', top)
					menu.style.top = top + "px"

					// let width = menu.scrollWidth;
					// let windowWidth = window.innerWidth;
					// if (left - width / 2 < 0) {
					// 	left = width / 2;
					// } else if (left + width / 2 > windowWidth) {
					// 	left = windowWidth - width / 2;
					// }

					// menu.style.left = left + "px";
					// Ensure that menu visible on top of the document
					// if (start.top < 50) {
					// 	menu.style.top = start.top + 40 + "px";
					// } else {
					// 	menu.style.top = start.top - 60 + "px";
					// }

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
						let container = event.target.closest(".editor");
						container.classList.remove("focused");
						// handle linkinput
						const linkInput = document.querySelector(".js-textmenu");
						const linkInputActive = [...linkInput.classList].includes("link");
						if (!linkInputActive) {
							container
								.querySelector(".js-textmenu")
								.classList.remove("active");
						}
					}
					return false;
				},
			},
		},
		appendTransaction(transaction, oldState, newState) { },
	});
}