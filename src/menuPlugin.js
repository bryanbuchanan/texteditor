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
    container.innerHTML =
      '<div class="textmenu__link"><input class="textmenu__linkinput" type="text" placeholder="Enter an address..."><div class="textmenu__linkclose">x</div></div>';

    let linkPrompt = container.querySelector("*");
    const input = container.querySelector("input");
    const inputCloseBtn = container.querySelector(".textmenu__linkclose");

    setupInputListeners(this.editorView, input, inputCloseBtn);

    this.dom.appendChild(linkPrompt);

    // Run conversions on item array
    items.forEach((item, index) => {
      // Convert strings to dom nodes
      if (typeof item.dom === "string") {
        let container = document.createElement("div");
        container.innerHTML = item.dom;
        items[index].dom = container.querySelector("*");
      }
      // Convert command shorthand
      if (item.command === "strong") {
        items[index].command = toggleMark(schema.marks.strong);
        items[index].checkActive = generalActiveCheck(schema.marks.strong);
      } else if (item.command === "em") {
        items[index].command = toggleMark(schema.marks.em);
        items[index].checkActive = generalActiveCheck(schema.marks.em);
      } else if (item.command === "h2") {
        items[index].command = toggleBlockType(editorView, "heading", {
          level: 2,
        });
        items[index].checkActive = generalActiveCheck(schema.nodes.heading, {
          level: 2,
        });
      } else if (item.command === "h3") {
        items[index].command = toggleBlockType(editorView, "heading", {
          level: 3,
        });
        items[index].checkActive = generalActiveCheck(schema.nodes.heading, {
          level: 3,
        });
      } else if (item.command === "link") {
        items[index].command = linkHandler(editorView);
        items[index].checkActive = generalActiveCheck(schema.marks.link);
      } else if (item.command === "blockquote") {
        items[index].command = toggleWrapIn(editorView, "blockquote");
        items[index].checkActive = generalActiveCheck(schema.nodes.blockquote);
      } else if (item.command === "hr") {
        items[index].command = insertAtEnd(editorView, "horizontal_rule");
      } else if (item.command === "ul") {
        items[index].command = toggleWrapIn(editorView, "bullet_list");
        items[index].checkActive = generalActiveCheck(schema.nodes.bullet_list);
      } else if (item.command === "ol") {
        items[index].command = toggleWrapIn(editorView, "ordered_list");
        items[index].checkActive = generalActiveCheck(
          schema.nodes.ordered_list
        );
      }
    });

    // Append to container
    items.forEach(({ dom }) => this.dom.appendChild(dom));

    // Update
    this.update(editorView, null);

    // Assign commands
    this.dom.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (!e.target.className.includes("textmenu__linkinput")) {
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

  update() {
    // Set menu buttons to 'active', if current selection matches the command the button would assign
    this.items.forEach(({ dom, checkActive }) => {
      if (checkActive && checkActive(this.editorView.state)) {
        dom.classList.add("active");
      } else {
        dom.classList.remove("active");
      }
    });

    let menu = this.editorView.dom
      .closest(".editor")
      .querySelector(".js-textmenu");

    if (menu) {
      // Show/hide menu
      if (this.editorView.state.selection.empty) {
        menu.classList.remove("active");
        menu.classList.remove("link");
      } else {
        menu.classList.add("active");
      }

      // Position menu
      let { from, to } = this.editorView.state.selection;
      let start = this.editorView.coordsAtPos(from),
        end = this.editorView.coordsAtPos(to);

      if (menu.offsetParent) {
        // let box = menu.offsetParent.getBoundingClientRect();
        let left = (start.left + end.left) / 2;
        let width = menu.scrollWidth;
        let windowWidth = window.innerWidth;
        if (left - width / 2 < 0) {
          left = width / 2;
        } else if (left + width / 2 > windowWidth) {
          left = windowWidth - width / 2;
        }
        menu.style.left = left + "px";
        // Ensure that menu visible on top of the document
        if (start.top < 50) {
          menu.style.top = start.top + 40 + "px";
        } else {
          menu.style.top = start.top - 60 + "px";
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
    appendTransaction(transaction, oldState, newState) {},
  });
}