class Menu {

	constructor(parameters) {

		// Create new menu bar
		this.dom = document.createElement('div')
		this.dom.className = "menu"

		// Loop through buttons
		for (const item of parameters.buttons) {

			// Convert button html string to dom node
			const dom = this.toHTML(item.dom)

			// Append new dom node to menu
			this.dom.appendChild(dom)
		
		}

		// Append finished menu bar to element
		parameters.element.appendChild(this.dom)

	}

	toHTML(string) {
		const div = document.createElement('div')
		div.innerHTML = string
		const html = div.querySelector('*')
		return html
	}

}

// Get list of matching elements
const elements = document.querySelectorAll('.test')

console.log(elements)

// Loop through each one
for (const element of elements) {

	const menu = new Menu({
		element: element,
		buttons: [
			{ dom: '<div>1</div>' },
			{ dom: '<div>2</div>' },
			{ dom: '<div>3</div>' },
		]
	})

	console.log(menu)

}


