# Example plugin usage

```

import { mymenu } from "./mymenu.js";

```
```

let menu = mymenu([
	{ command: whatever(), label: '<strong>B<strong>' },
	{ command: whatever(), label: '<em>Italic</em>' },
	{ command: whatever(), label: '<i class="fal fa-heading"></i>' },
	etc...
]);

```
```

let view = new EditorView(editorNode, {
	state: EditorState.create({
		doc: DOMParser.fromSchema(schema).parse(contentNode),
		plugins: [
			menu,
			keybinding stuff...
		]
	});
});

```