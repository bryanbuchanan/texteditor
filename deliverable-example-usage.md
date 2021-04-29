```

import { mymenu } from "./mymenu.js";

```
```

let menu = mymenu([
	{ command: whatever(), label: '<strong>B<strong>' },
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