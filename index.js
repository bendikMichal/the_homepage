
const find = () => {
	console.log(searchbar);
	let search_value = searchbar.value;
	window.location.href = `https://duckduckgo.com/?q=${encodeURI(search_value)}`;
}

let searchbar = document.getElementsByClassName("searchbar")[0];
let search_form = document.getElementById("searchform");
let search_button = document.getElementsByClassName("glass")[0];
search_form.onsubmit= find;
search_button.onclick = find;

console.log(search_button);


