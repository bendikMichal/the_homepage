/*
	* Readme
	* Place this in your firefox profile and it will change the default
	* new tab to be "THE" homepage
	* */

const { os } = Components.utils.import("resource://gre/modules/os.jsm");
let username = null;
let path = null;
const app_name = "THE_homepage";

const ag = navigator.userAgent;

if (ag.indexOf("Windows") !== -1) {
	username = os.getenv("USERNAME");
	path = `C:\\Users\\${user}\\AppData\\LocalLow\\${app_name}\\index.html`;
}

// I don't own a mac to test this on
// else if (ag.indexOf("Linux") !== -1 || ag.indexOf("Mac") !== -1) {
else if (ag.indexOf("Linux") !== -1) {
	username = os.getenv("USER");
	path = `/home/${user}/${app_name}/index.html`;
}


if (username !== null) user_pref("browser.newtab.url", path);

