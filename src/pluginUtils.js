import { lift, setBlockType, toggleMark, wrapIn } from "prosemirror-commands";
import { liftListItem, wrapInList } from "prosemirror-schema-list";

// Utility in place of native chainCommands, to prevent it from stopping on first truthy value
function chainTransactions(...commands) {
  return (state, dispatch) => {
    const dispatcher = (tr) => {
      state = state.apply(tr);
      dispatch(tr);
    };
    const last = commands.pop();
    const reduced = commands.reduce((result, command) => {
      return result || command(state, dispatcher);
    }, false);
    return reduced && last !== undefined && last(state, dispatch);
  };
}

// Check if selection has an active type
export const generalActiveCheck = (type, options = {}) => (state) => {
  const schema = state.schema;
  const { $from, $head, to, $to, node } = state.selection;
  let hasMarkup;

  hasMarkup =
    node?.hasMarkup(schema.nodes[type], options) ||
    $head.marks().some((v) => v.type.name === type?.name) ||
    (to <= $from.end() && $from.parent.hasMarkup(type, options));

  // handle wrapins
  if (["block+", "list_item+"].includes(type.spec.content)) {
    const parent = $from.node(1);
    hasMarkup = parent?.type.name === type?.name;
  }

  // check link
  if (type.name === "link") {
    hasMarkup = state.doc.rangeHasMark($from.pos, $to.pos, schema.marks.link);
  }

  return hasMarkup;
};

const selfClosingListener = (element, eventType, callback) => {
  function handler(ev) {
    callback(ev);
    element.removeEventListener(eventType, handler);
  }
  element.addEventListener(eventType, handler);
};

// Abstraction to toggle supported block types on and off
export const toggleBlockType = (editorView, type, options = {}) => (
  state,
  dispatch
) => {
  const { schema } = editorView.state;

  return generalActiveCheck(schema.nodes[type], options)(state, dispatch)
    ? setBlockType(schema.nodes.paragraph)(state, dispatch)
    : setBlockType(schema.nodes[type], options)(state, dispatch);
};

// Abstraction to toggle wrappers on and off
export const toggleWrapIn = (editorView, type) => (state, dispatch) => {
  const schema = editorView.state.schema;
  const hasSpecificWrapper = generalActiveCheck(schema.nodes[type])(
    state,
    dispatch
  );

  // handle list toggling
  if (type.includes("list")) {
    const oppositeListType =
      type === "bullet_list" ? "ordered_list" : "bullet_list";
    const isOpposite = generalActiveCheck(schema.nodes[oppositeListType])(
      state,
      dispatch
    );
    const switchListType = () =>
      chainTransactions(
        liftListItem(schema.nodes.list_item),
        wrapInList(schema.nodes[type])
      )(state, dispatch);

    return isOpposite
      ? switchListType()
      : hasSpecificWrapper
      ? liftListItem(schema.nodes.list_item)(state, dispatch)
      : wrapInList(schema.nodes[type])(state, dispatch);
  }

  return hasSpecificWrapper
    ? lift(state, dispatch)
    : wrapIn(schema.nodes[type])(state, dispatch);
};

// Insert node at the end of the selection
export const insertAtEnd = (editorView, type) => (_, dispatch) => {
  const schema = editorView.state.schema;
  const { to } = editorView.state.selection;
  const tr = editorView.state.tr;
  const node = schema.nodes[type].create();

  tr.insert(to, node);
  return dispatch(tr);
};

// ==== link utils

// Append "http" if doesnt exist
const appendUrlPrefix = (url) =>
  url.startsWith("http")
    ? url
    : url.startsWith("mailto:")
    ? url
    : `http://${url}`;

// Build <a /> element and append it to editor
const createAnchor = (linkProps, editorView, schema) => {
  const node = schema.text(linkProps.title, [
    schema.marks.link.create({
      ...linkProps,
      href: appendUrlPrefix(linkProps.href),
    }),
  ]);
  return editorView.dispatch(
    editorView.state.tr.replaceSelectionWith(node, false)
  );
};

// Hide input menu
export const hideLinkInput = (editorView) =>
  editorView.dom
    .closest(".editor")
    .querySelector(".js-textmenu")
    .classList.remove("link");

export const resetInput = (editorView, input) => {
  hideLinkInput(editorView);
  input.value = "";
  editorView.focus();
};

const handleLinkInputSubmit = (editorView, schema, selectedText, input) => (
  ev
) => {
  if (ev.key === "Enter") {
    const { value } = ev.target;
    const url = appendUrlPrefix(value);
    createAnchor({ href: url, title: selectedText }, editorView, schema);
    resetInput(editorView, input);
  } else if (ev.key === "Escape") {
    resetInput(editorView, input);
  }
};

// handles link creation
export const linkHandler = (editorView) => (state, dispatch) => {
  const schema = editorView.state.schema;
  const { $from, from, to, $to } = editorView.state.selection;

  const isLink = editorView.state.doc.rangeHasMark(
    $from.pos,
    $to.pos,
    schema.marks.link
  );
  // remove link if it already exists
  if (isLink) {
    return toggleMark(schema.marks.link)(state, dispatch);
  }

  const input = document.querySelector(".textmenu__linkinput");

  const selectionFragment = editorView.state.doc.cut(from, to);
  const selectedText = selectionFragment.textContent;

  // automatically replace with href if plain text has a link format
  const urlRegex = new RegExp(
    "(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})",
    "g"
  );

  if (
    selectedText?.match(urlRegex)?.length === 1 &&
    selectedText?.split(" ").length === 1
  ) {
    return createAnchor(
      { href: selectedText, title: selectedText },
      editorView,
      schema
    );
  }

  const submit = handleLinkInputSubmit(editorView, schema, selectedText, input);

  editorView.dom
    .closest(".editor")
    .querySelector(".js-textmenu")
    .classList.add("link");

  input.addEventListener("keyup", submit);

  const closeElementCallback = () => {
    resetInput(editorView, input);
    input.removeEventListener("keyup", submit);
  };

  selfClosingListener(input, "blur", closeElementCallback);

  input.focus();
};

// eventListeners

export const setupInputListeners = (editorView, input, inputCloseBtn) => {
  inputCloseBtn.addEventListener("click", () => {
    input.value = "";
    hideLinkInput(editorView);
  });
};
