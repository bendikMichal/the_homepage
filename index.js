
const clock_update_seconds = 10;

const find = () => {
	console.log(searchbar);
	let search_value = searchbar.value;
	window.location.href = `https://duckduckgo.com/?q=${encodeURI(search_value)}`;
}

const set_clock = () => {
	const str = formatter.format(new Date());
	clock.textContent = str;
}

let searchbar = document.getElementsByClassName("searchbar")[0];
let search_button = document.getElementsByClassName("glass")[0];
let clock = document.getElementsByClassName("clock")[0];

searchbar.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.keyCode === 13) find()
});
search_button.onclick = find;

document.body.style.backgroundImage = "url(\"https://picsum.photos/2048\")" 
const formatter = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' });
set_clock();
let clock_interval = setInterval(set_clock, clock_update_seconds * 1000);


