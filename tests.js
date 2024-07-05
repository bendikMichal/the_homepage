

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

const time_to_romans = (str, char = ':') => {
	let num_arr = str.split(char).map(item => parseInt(item));
	return num_arr.map(item => to_roman(item)).join(char);
}

/**
 * @method test_romans
 * @param {String} time - date in string format
 * @param {String} expect - expected string output 
 */
const test_romans = (time, expect) => {
	let passed = false;


	const res = time_to_romans(time);
	passed = expect === res;

	if ( passed ) {
		console.log("Passed for time:", time);
	}
	else {
		console.log("Test failed for time: ", time, "with result:", res, "expected: ", expect);
	}
}

test_romans("11:24:00", "XI:XXIV:I");
test_romans("12:00:00", "XII:I:I");
test_romans("7:25:45", "VII:XXV:XLV");
