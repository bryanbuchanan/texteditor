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
        { type: "strong", title: "Bold", icon: '<i class="fas fa-bold"></i>' },
        { type: "em", title: "Italic", icon: '<i class="fal fa-italic"></i>' },
        { type: "link", title: "Create a link", icon: '<i class="fal fa-link"></i>' },
        { type: "divider", icon: '' },
        { type: "h2", title: "Large Heading", icon: '<i class="fal fa-heading"></i>' },
        { type: "h3", title: "Small Heading", icon: '<i class="fal fa-heading"></i>' },
        { type: "divider", icon: '' },
        { type: "ul", title: "Bullet List", icon: '<i class="fal fa-list"></i>' },
        { type: "ol", title: "Numbered List", icon: '<i class="fal fa-list-ol"></i>' },
        { type: "blockquote", title: "Quote", icon: '<i class="fal fa-quote-left"></i>' },
        { type: "hr", title: "Horizontal Line", icon: 'hr' }
    ],
    save: (data) => {
        console.log(data)
    }
})
```

