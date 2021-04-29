# Custom Prosemirror Menu Job Description

(Not complete)

I'm in need of assistance wrapping up a popup Prosemirror menu plugin. My work in progress can be viewed [here](https://github.com/bryanbuchanan/texteditor)

### Todo

### Buttons

I'll need functionality for these buttons in the menu:

- strong (done)
- em (done)
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


