# Custom Prosemirror Menu Job Description

I'm in need of assistance wrapping up a popup Prosemirror menu plugin. A working demo of the plugin so far can be viewed [here](https://github.com/bryanbuchanan/texteditor)

### Todo/Scope

#### Complete Button Functionality

- **strong** (done)
- **em** (done)
- **Spacers** (done)
- **link**: When clicked, check if the current selection includes a link
	- If selection *doesn't* include a link, the link prompt should take over the menu bar to allow the creation of a new link
		- When the enter key is pressed:
			- `http://` should be prefixed to the address if not already present, unless `mailto:`` is present, to allow people to enter email links, too.
			- The link created
			- The link prompt disappears
		- When the "x" button is clicked, close the prompt
	- If the selection *does* include a link, remove the link
- **h2/h3**: The current button only creates headings, but it needs to toggle headings back to normal paragraphs when clicked a second time
- **ul/ol**: Similarly, these need to act as toggles and return blocks back to paragraphs if clicked a second time. No nesting is necessary.
- **blockquote**: Ditto, should act as a toggle.
- **hr**: Needs to insert a hr at the cursor. No toggle needed as normal backspace should erase the hr

The insertion of anything else like (linked) images and video embeds are not necessary, but the plugin should be constructed in a way that these things can be added later on if needed.


