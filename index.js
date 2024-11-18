
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

const is_valid_number = (str) => +str === parseInt(str) || +str == parseFloat(str);

const to_roman = (num) => {
	if (num === 0) return "I";
	if (!num || isNaN(num)) return NaN;

	const _numer = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
	const _roman = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
	let res = "";

	while (num > 0) {
		for (let i = 0; i < _numer.length; i++) {
			if (_numer[i] > num) continue;

			res = res + _roman[i];
			num -= _numer[i];
			break;
		}
	}
	return res;
}

const to_bin = (num) => (num ?? 0).toString(2);

const time_to_romans = (str, char = ':') => {
	let num_arr = str.split(char).map(item => parseInt(item));
	return num_arr.map(item => to_roman(item)).join(char);
}

const time_to_binary = (str, char = ':') => {
	let num_arr = str.split(char).map(item => parseInt(item));
	return num_arr.map(item => to_bin(item)).join(char);
}

const is_number_key = (event) => {
	let charCode = (event.which) ? event.which : event.keyCode;
	return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

const find = async () => {
	let search_value = searchbar.value;
	// window.location.href = `https://duckduckgo.com/?q=${encodeURI(search_value)}`;
	// console.log(await browser.search.get(), browser.search);
	browser.search.query({ text: search_value, disposition: browser.search.Disposition.CURRENT_TAB });
}

const set_clock = () => {
	let str = formatter.format(new Date());
	let part = "";
	const f24 = settings_data[TIME_FORMAT24] ?? false;

	if (!f24) [ str, part ] = str.split(" ");

	if (use_romans) str = time_to_romans(str);
	else if (use_binary) str = time_to_binary(str);

	if (!f24) str = `${str} ${part}`;
	// if (!f24 && part) str = `${str} ${part}`;

	clock.textContent = str;

	// change date too
	const cd = (new Date()).toDateString();
	if (cd !== date_display.textContent) {
		date_display.textContent = cd;
	}
}

const set_time_format = () => {
	const f24 = settings_data[TIME_FORMAT24] ?? false;
	formatter = new Intl.DateTimeFormat(time_format, { hour12: !f24, hour: '2-digit', minute: '2-digit', second: display_seconds ? "2-digit" : undefined });
	set_clock();
}

const get_time_format = (f24) => {
	return f24 ? "UTC" : "en-US";
}

const handle_date_display = () => {
	date_display.style.display = display_date ? "inherit" : "none";
}

let settings_open = false;
const toggle_settings = () => {
	settings_open = !settings_open;
	// settings_menu.style.display = settings_open ? "flex" : "none";
	settings_menu.style.height = settings_open ? "360px" : "0px";
}
const close_settings = () => {
	settings_open = false;
	// settings_menu.style.display = settings_open ? "flex" : "none";
	settings_menu.style.height = settings_open ? "360px" : "0px";
}

const set_bg_image = async (url, image_file_data) => {
	// checking twice cuz it takes time to load and it is not awaited in init, to speed up load times
	console.log(use_single_color);
	if (use_single_color) return;

	let fin_url = "";
	if (url) {

		let res = null;
		try {
			res = await fetch(url);
		} catch {

		}

		let href = document.getElementById("image-url-download");
		if (res && res.url) {
			url = res.url;
		}
		href.href = url;
		fin_url = url;
	}

	else if (image_file_data) {
		let res = await fetch(image_file_data);
		let lurl = URL.createObjectURL(await res.blob());
		console.log("blob url from b64:", lurl);
		fin_url = lurl;
	}

	if (use_single_color) return;
	// document.body.style.backgroundImage = `url("${url}")`;
	document.body.style["background-image"] = `url("${fin_url}")`;
}

const disable_bg_image = () => {
	document.body.style["background-image"] = ``;
}

const get_color_picker_by_name = (name) => {
	let all = document.getElementsByClassName("colorpicker-input");
	all = Array.from(all);
	return all.filter(item => item.getAttribute("name") === name)[0];
}

const get_color_picker_preview_by_name = (name) => {
	let all = document.getElementsByClassName("colorpicker-preview");
	all = Array.from(all);
	return all.filter(item => item.getAttribute("name") === name)[0];
}

const valid_hex = /^#([0-9A-F]{3}){1,2}$/i;
const update_picker_preview = (name) => {
	let picker = get_color_picker_by_name(name);
	if (!valid_hex.test(picker.value)) return;

	let prew = get_color_picker_preview_by_name(name);
	prew.style["background-color"] = picker.value;
	prew.style["box-shadow"] = `0 0 4px ${picker.value}`;
}

const handle_color_pickers = () => {
	let cps = document.getElementsByClassName("colorpicker-input");
	for (let picker of cps) {
		let name = picker.getAttribute("name");
		update_picker_preview(name);
		picker.oninput = () => update_picker_preview(name);
		picker.onchange = () => update_picker_preview(name);
	}
}

const resize_searchbar_font = () => {
	document.getElementsByClassName("searchbar")[0].style["font-size"] = `${base_font_size * search_text_size * 0.01}px`;
	// new glass height
	document.getElementsByClassName("glass")[0].style.height = `${document.getElementsByClassName("searchbar")[0].offsetHeight - 4}px`;
}

const set_display_title = () => {
	let title = document.getElementsByClassName("title")[0];
	title.style.display = display_title ? "inherit" : "none";
}

// sync load

// default settings
let clock_update_seconds = 10;
let image_url = "https://picsum.photos/2048";
let image_file = "";
let use_single_color = false;
let bg_color = "#000";
let time_format = "en-US"; // UTC for 24h
let display_seconds = false;
let display_date = false;
let use_romans = false;
let use_binary = false;
let search_text_size = 100; // in %
const base_font_size = 13; // px
let display_title = true;

const CLOCK_INTERVAL = "CLOCK_INTERVAL";
const IMAGE_URL = "IMAGE_URL";
const IMAGE_B64 = "IMAGE_B64";
const USE_SINGLE_COLOR = "USE_SINGLE_COLOR";
const BG_COLOR = "BG_COLOR";
const TIME_FORMAT24 = "TIME_FORMAT24";
const DISPLAY_SECONDS = "DISPLAY_SECONDS";
const DISPLAY_DATE = "DISPLAY_DATE";
const USE_ROMANS = "USE_ROMANS";
const USE_BINARY = "USE_BINARY";
const SEARCH_TEXT_SIZE = "SEARCH_TEXT_SIZE";
const DISPLAY_TITLE = "DISPLAY_TITLE";

const CHECKBOX_CHECKED = "https://img.icons8.com/ios-glyphs/30/checked-checkbox.png";
const CHECKBOX_UNCHECKED = "https://img.icons8.com/fluency-systems-regular/48/unchecked-checkbox.png";

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
		clock_update_seconds = num;
		save_data("settings", settings_data);

		if (clock_interval) clearInterval(clock_interval);
		clock_interval = setInterval(set_clock, clock_update_seconds * 1000);
		console.log("New clock update interval:", clock_update_seconds, settings_data);
	}
});


let image_url_input = document.getElementById("image-url");
image_url_input.addEventListener('input', () => {

	settings_data[IMAGE_URL] = image_url_input.value;
	image_url = image_url_input.value;
	save_data("settings", settings_data);

	set_bg_image(image_url, image_file);
	console.log("New image url: ", image_url, settings_data);
});

let image_fileinput = document.getElementById("image-file");
image_fileinput.addEventListener('change', event => {
    const file = event.target.files[0];
	if (!file) return;

	const reader = new FileReader();

	reader.onload = e => {
		const file_data = e.target.result;
		console.log("loaded file:", file_data);
		image_file = file_data;
		settings_data[IMAGE_B64] = file_data;

		save_data("settings", settings_data);
		set_bg_image(image_url, image_file);
	};
	// reader.readAsText(file);
	reader.readAsDataURL(file);
});

let single_color_checkbox = document.getElementById("single-color-checkbox");
single_color_checkbox.onchange = () => {
	let on = single_color_checkbox.checked;

	use_single_color = on;
	settings_data[USE_SINGLE_COLOR] = on;
	if (on) disable_bg_image();
	else set_bg_image(image_url, image_file);

	save_data("settings", settings_data);
}

let colorpicker_input = document.getElementById("bg-colorpicker");
colorpicker_input.addEventListener('input', () => {

	if (!valid_hex.test(colorpicker_input.value)) return;

	settings_data[BG_COLOR] = colorpicker_input.value;
	bg_color = colorpicker_input.value;
	document.body.style["background-color"] = bg_color;
	save_data("settings", settings_data);

	console.log("New bg color: ", bg_color, settings_data);
});

let format24h_checkbox = document.getElementById("format24h-checkbox");
format24h_checkbox.onchange = () => {
	let on = format24h_checkbox.checked;
	time_format = get_time_format(on);
	settings_data[TIME_FORMAT24] = on;
	set_time_format();

	save_data("settings", settings_data);
	console.log("New time format:", time_format);
}

let seconds_checkbox = document.getElementById("seconds-checkbox");
seconds_checkbox.onchange = () => {
	let on = seconds_checkbox.checked;
	display_seconds = on;
	settings_data[DISPLAY_SECONDS] = on;
	set_time_format();

	save_data("settings", settings_data);
}

let date_checkbox = document.getElementById("date-checkbox");
date_checkbox.onchange = () => {
	let on = date_checkbox.checked;
	display_date = on;
	handle_date_display();

	settings_data[DISPLAY_DATE] = on;
	save_data("settings", settings_data);
}

let romans_checkbox = document.getElementById("romans-checkbox");
let binary_checkbox = document.getElementById("binary-checkbox");

romans_checkbox.onchange = () => {
	let on = romans_checkbox.checked;
	use_romans = on;
	use_binary = on ? false : use_binary;
	binary_checkbox.checked = use_binary;
	settings_data[USE_ROMANS] = use_romans;
	settings_data[USE_BINARY] = use_binary;

	set_clock();
	save_data("settings", settings_data);
}

binary_checkbox.onchange = () => {
	let on = binary_checkbox.checked;
	use_binary = on;
	use_romans = on ? false : use_romans;
	romans_checkbox.checked = use_romans;
	settings_data[USE_ROMANS] = use_romans;
	settings_data[USE_BINARY] = use_binary;

	set_clock();
	save_data("settings", settings_data);
}

let search_text_size_input = document.getElementById("search-text-size-input");
search_text_size_input.addEventListener('input', () => {
	let new_size = new Number(search_text_size_input.value);
	if (!is_valid_number(new_size)) return;

	new_size = +new_size;
	search_text_size = new_size;
	settings_data[SEARCH_TEXT_SIZE] = new_size;
	resize_searchbar_font();

	save_data("settings", settings_data);
});

let title_checkbox = document.getElementById("title-checkbox");
title_checkbox.onchange = () => {
	let on = title_checkbox.checked;
	
	display_title = on;
	settings_data[DISPLAY_TITLE] = on;
	set_display_title();

	save_data("settings", settings_data);
}


let settings_menu = document.getElementsByClassName("settings-menu")[0];
let settings_button = document.getElementsByClassName("settings")[0];
settings_button.onclick = toggle_settings;

settings_menu.onblur = close_settings;
document.addEventListener('click', event => {
  if (!settings_menu.contains(event.target) && !settings_button.contains(event.target)) close_settings();
});

let date_display = document.getElementsByClassName("date")[0];

let formatter = new Intl.DateTimeFormat(time_format, { hour: '2-digit', minute: '2-digit' });

let clock_interval = null;
let settings_data = {};

// async load
const init = async () => {
	settings_data = await load_data("settings");
	console.log(settings_data);

	// setting settings
	clock_update_seconds = settings_data[CLOCK_INTERVAL] ?? clock_update_seconds;
	clock_interval_input.value = `${clock_update_seconds}`;

	image_url = settings_data[IMAGE_URL] ?? image_url;
	image_url_input.value = image_url;
	
	image_file = settings_data[IMAGE_B64] ?? image_file;
	set_bg_image(image_url, image_file);

	use_single_color = settings_data[USE_SINGLE_COLOR] ?? use_single_color;
	single_color_checkbox.checked = use_single_color;
	if (use_single_color) disable_bg_image();

	// load romans before setting clock
	use_romans = settings_data[USE_ROMANS] ?? use_romans;
	romans_checkbox.checked = use_romans;

	use_binary = settings_data[USE_BINARY] ?? use_binary;
	binary_checkbox.checked = use_binary;

	time_format = get_time_format(settings_data[TIME_FORMAT24]);
	format24h_checkbox.checked = settings_data[TIME_FORMAT24] ?? false;

	display_seconds = settings_data[DISPLAY_SECONDS] ?? display_seconds;
	seconds_checkbox.checked = display_seconds;
	set_time_format(); // for both format24 and seconds

	display_date = settings_data[DISPLAY_DATE] ?? display_date;
	date_checkbox.checked = display_date;
	handle_date_display();

	search_text_size = settings_data[SEARCH_TEXT_SIZE] ?? search_text_size;
	search_text_size_input.value = `${search_text_size}`;
	resize_searchbar_font();

	display_title = settings_data[DISPLAY_TITLE] ?? display_title;
	title_checkbox.checked = display_title;
	set_display_title();


	bg_color = settings_data[BG_COLOR] ?? bg_color;
	colorpicker_input.value = bg_color;
	document.body.style["background-color"] = bg_color;
	handle_color_pickers();


	// setting version from manifest
	const manifest = await require_file("manifest.json");

	let version_field = document.getElementById("version");
	version_field.textContent = manifest["version"];

	clock_interval = setInterval(set_clock, clock_update_seconds * 1000);
}

init();
