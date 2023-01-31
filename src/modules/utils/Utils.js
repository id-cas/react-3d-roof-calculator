export function cls(str){
	const cssp = "__xr";
	return cssp + ' ' + str.split(' ').map((val, index) => { return cssp + '-' + val }).join(' ');
}

export function id(str){
	const cssp = "__xr";
	return str.split(' ').map((val, index) => { return cssp + '-' + val }).join(' ');
}

export function formatPrice(price) {
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
};

export function newItemId(){
	return 'id' + Date.now();
}


// export function isSet (arg) {
// 	return (undefined !== arg && null !== arg);
// };

// export function isEmpty (arg) {
// 	if (!isSet(arg)) return true;

// 	if (/string|number/.test(typeof arg)) {
// 		return arg === '' || arg === 0;
// 	}

// 	if (isArray(arg)) {
// 		return arg.length < 1;
// 	}

// 	var keys = Object.keys(arg);

// 	return keys.length < 1;
// };

