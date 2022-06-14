
const names = {
	'ru': 'Russia',
	'au': 'Australia',
	'bel': 'Belarus',
	'bra': 'Brazil',
	'UK': 'United Kingdom',
	'can': 'Canada',
	'chi': 'China',
	'fra': 'France',
	'ger': 'Germany',
	'ind': 'India',
	'jap': 'Japan',
	'kaz': 'Kazakhstan',
	'mon': 'Mongolia',
	'spa': 'Spain',
	'ua': 'Ukraine',
	'usa': 'United States'
};

const countries = {
	 "Russia": [
	"Население: 140млн",
	"Столица: Москва",
	"Язык: Русский",
	"Валюта: Росийский Рубль"
  ]
}
let container = null;
let dialog = null;
setTimeout(() => {
	container = document.querySelector(`#v3d-container`);
	dialog = document.querySelector('.dialog-info')
	const children = container.childNodes
	children.forEach((ch) => {
		ch.addEventListener('click', () => {
			if (ch.classList.contains('v3d-annotation')) {
				if (ch.style.zIndex == 2) {
					dialog.innerHTML = ''
					dialog.style = 'visibility: visible'
					const name = names[ch.id]
					if (countries[name] === undefined) {
						dialog.style = 'visibility: hidden'
					}
					countries[name].forEach(city => {
						dialog.innerHTML += `<p>${city}</p>`
					})
				} else {
					dialog.style = 'visibility: hidden'
				}
			} else {
				return
			}
			
		})
	})
	
},5000);