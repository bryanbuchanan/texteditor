# Custom Prosemirror Menu Job Description

I'm in need of a custom popup Prosemirror menu, similar to the menu found on [Medium.com](http://medium.com)'s text editor.

I have a barely-working proof here, which can serve as illustration for the behaviors required, but

<https://github.com/bryanbuchanan/texteditor>


```
<div class="textmenu js-textmenu">
	{{button_dom}}
	{{button_dom}}
	{{button_dom}}
	...
</div>
```

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

</div>




## Requirements

### Menu

- It should be a popup menu, hidden by way of a css class until a selection is made, at which point it's displayed centered above the selection
- Should be hidden when the text editor loses focus
- Needs to support multiple Prosemirror instances on a single page. I believe this is the default behavior or correctly-constructed plugins, but may be worth mentioning, anyway.

### Buttons

I'll need functionality for these buttons in the menu:

- strong
- em
- link
- h3
- h4
- ul
- ol
- blockquote
- hr
- Spacers (space to help divide the menu buttons into groups)

The insertion of anything else like images and video embeds are not necessary, but the plugin should be constructed in a way that these things can be added later on if needed.

When a button is clicked, it should be assigned an "active" class.

Each button (excluding hr) should act as a toggle, undoing the formatting if clicked a second time. For example, h3 should format a block back to a paragraph if clicked a second time, and blockquotes should unwrap themselves if clicked a second time.

### Key Bindings

I'm not sure if key bindings fall within the scope of a menu plugin, but regardless, I'd like all the expected key binding to be present:

- cmd+z/cmd+y
- cmd+b
- cmd+i
- up/down/left/right
- cmd+up/down/left/right
- shift+enter for hard return





```
import { mymenu } from "./mymenu.js";
```

```
let menu = mymenu([
	{ command: whatever(), dom: '<div title="Bold" class="textmenu__button textmenu__button--bold js-bold"><i class="fas fa-bold"></i></div>' },
	{ command: whatever(), label: '<em>Italic</em>' },
	{ command: whatever(), label: '<i class="fal fa-heading"></i>' },
	{ divider },
	etc...
]);
```

```
let view = new EditorView(editorNode, {
	state: EditorState.create({
		doc: DOMParser.fromSchema(schema).parse(contentNode),
		plugins: [
			menu,
			keybinding
		]
	});
});
```