import Editor from "../dist/editor.js"

const texts = document.querySelectorAll('.text')

for (const text of texts) {

	Editor({
		element: text,
		content: '.content',
		editor: '.editor',
		menu: [
			{ command: "strong", dom: '<div title="Bold" class="textmenu__button textmenu__button--bold js-bold"><i class="fas fa-bold"></i></div>' },
			{ command: "em", dom: '<div title="Italic" class="textmenu__button textmenu__button--italic js-italic"><i class="fal fa-italic"></i></div>' },
			{ command: "link", dom: '<div title="Link" class="textmenu__button textmenu__button--link js-link"><i class="fal fa-link"></i></div>' },
			{ command: false, dom: '<div class="textmenu__divider"></div>' },
			{ command: "h2", dom: '<div title="Big Heading" class="textmenu__button textmenu__button--heading2 js-heading2"><i class="fal fa-heading"></i></div>' },
			{ command: "h3", dom: '<div title="Small Heading" class="textmenu__button textmenu__button--heading3 js-heading3"><i class="fal fa-heading"></i></div>' },
			{ command: null, dom: '<div class="textmenu__divider"></div>' },
			{ command: "ul", dom: '<div title="Bullet List" class="textmenu__button textmenu__button--list js-list"><i class="fal fa-list"></i></div>' },
			{ command: "ol", dom: '<div title="Numbered List" class="textmenu__button textmenu__button--numberedlist js-numberedlist"><i class="fal fa-list-ol"></i></div>' },
			{ command: "blockquote", dom: '<div title="Quote" class="textmenu__button textmenu__button--quote js-quote"><i class="fal fa-quote-left"></i></div>' },
			{ command: "hr", dom: '<div title="Horizontal Rule" class="textmenu__button textmenu__button--quote js-quote">hr</div>' }
		],
		save: (data) => {
			console.log(data)
		}
	})

}


// let parameters = {
// 	content: '.content',
// 	editor: '.editor',
// 	menu: [
// 		{ command: "strong", dom: '<div title="Bold" class="textmenu__button textmenu__button--bold js-bold"><i class="fas fa-bold"></i></div>' },
// 		{ command: "em", dom: '<div title="Italic" class="textmenu__button textmenu__button--italic js-italic"><i class="fal fa-italic"></i></div>' },
// 		{ command: "link", dom: '<div title="Link" class="textmenu__button textmenu__button--link js-link"><i class="fal fa-link"></i></div>' },
// 		{ command: false, dom: '<div class="textmenu__divider"></div>' },
// 		{ command: "h2", dom: '<div title="Big Heading" class="textmenu__button textmenu__button--heading2 js-heading2"><i class="fal fa-heading"></i></div>' },
// 		{ command: "h3", dom: '<div title="Small Heading" class="textmenu__button textmenu__button--heading3 js-heading3"><i class="fal fa-heading"></i></div>' },
// 		{ command: null, dom: '<div class="textmenu__divider"></div>' },
// 		{ command: "ul", dom: '<div title="Bullet List" class="textmenu__button textmenu__button--list js-list"><i class="fal fa-list"></i></div>' },
// 		{ command: "ol", dom: '<div title="Numbered List" class="textmenu__button textmenu__button--numberedlist js-numberedlist"><i class="fal fa-list-ol"></i></div>' },
// 		{ command: "blockquote", dom: '<div title="Quote" class="textmenu__button textmenu__button--quote js-quote"><i class="fal fa-quote-left"></i></div>' },
// 		{ command: "hr", dom: '<div title="Horizontal Rule" class="textmenu__button textmenu__button--quote js-quote">hr</div>' }
// 	],
// 	save: (data) => {
// 		console.log(data)
// 	},
// }








