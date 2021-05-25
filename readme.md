## Prosemirror-based drop-in editor

#### Tests

- [One instance](https://bryanbuchanan.github.io/texteditor/test/)
- [Multiple instances on one page](https://bryanbuchanan.github.io/texteditor/test/multiple.html)
- [Multiple instances inside iframe](https://bryanbuchanan.github.io/texteditor/test/frame.html)

#### TODO

- ol/ul buttons cause errors
- When editing an item inside an ol/ul, the enter key should create a new list item instead of a new paragraph

#### Usage

```javascript
import Editor from "../dist/editor.js"

Editor({
    element: document.querySelector('.text'),
    menu: [
        { type: "strong", title: "Bold", icon: '<strong>B</strong>' },
        { type: "em", title: "Italic", icon: '<em>i</em>' },
        { type: "link", title: "Create a link", icon: 'link' },
        { type: "divider", icon: '' },
        { type: "h2", title: "Large Heading", icon: 'h2' },
        { type: "h3", title: "Small Heading", icon: 'h3' },
        { type: "divider", icon: '' },
        { type: "ul", title: "Bullet List", icon: 'ul' },
        { type: "ol", title: "Numbered List", icon: 'ol' },
        { type: "blockquote", title: "Quote", icon: 'quote' },
        { type: "hr", title: "Horizontal Line", icon: 'hr' }
    ],
    change: (data) => {
        console.log(data)
    }
})
```

