
const require_file = async (path) => {
	let f = await fetch(path, {
	  headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*'
	  }
	});

	f = await f.json();
	return f;	
}

const save_data = (key, data) => {
	browser.storage.local.set({ [key]: data });
}

const load_data = async (key, default_data = {}) => {
	let data = await browser.storage.local.get(key);
	return data[key] ?? default_data;
}

const is_number_key = (event) => {
	let charCode = (event.which) ? event.which : event.keyCode;
	return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

const find = () => {
	console.log(searchbar);
	let search_value = searchbar.value;
	window.location.href = `https://duckduckgo.com/?q=${encodeURI(search_value)}`;
}

const set_clock = () => {
	const str = formatter.format(new Date());
	clock.textContent = str;
}

let settings_open = false;
const open_settings = () => {
	settings_open = !settings_open;
	settings_menu.style.display = settings_open ? "flex" : "none";
}
const close_settings = () => settings_open = true && open_settings();


// sync load

// default settings
let clock_update_seconds = 10;
let image_url = "https://picsum.photos/2048";
const CLOCK_INTERVAL = "CLOCK_INTERVAL";

// setting-up elements
let searchbar = document.getElementsByClassName("searchbar")[0];
let search_button = document.getElementsByClassName("glass")[0];
let clock = document.getElementsByClassName("clock")[0];

searchbar.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.keyCode === 13) find()
});
search_button.onclick = find;

let clock_interval_input = document.getElementById('clock-interval');
clock_interval_input.addEventListener('input', () => {
	let val = clock_interval_input.value;
	if (val !== "") {
		let num = Number(val);
		if (num < 1) num = 1;
		if (num > 60) num = 60;
		settings_data[CLOCK_INTERVAL] = num;
		save_data("settings", settings_data);
		clock_update_seconds = num;
		if (clock_interval) clearInterval(clock_interval);
		clock_interval = setInterval(set_clock, clock_update_seconds * 1000);
		console.log("New clock update interval:", clock_update_seconds, settings_data);
	}
});

let settings_menu = document.getElementsByClassName("settings-menu")[0];
let settings_button = document.getElementsByClassName("settings")[0];
settings_button.onclick = open_settings;

document.body.style.backgroundImage = `url("${image_url}")`
settings_menu.onblur = close_settings;

const formatter = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' });
set_clock();

let clock_interval = null;
let settings_data = null;

// async load
const init = async () => {
	const manifest = await require_file("manifest.json");
	settings_data = await load_data("settings");
	console.log(settings_data);
	clock_update_seconds = settings_data[CLOCK_INTERVAL] ?? clock_update_seconds;
	clock_interval_input.value = `${clock_update_seconds}`;

	let version_field = document.getElementById("version");
	version_field.textContent = manifest["version"];

	clock_interval = setInterval(set_clock, clock_update_seconds * 1000);
}

init();
