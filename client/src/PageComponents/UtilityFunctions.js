function formatQuery(dataObject) {
	var temp = [];
	const keys = Object.keys(dataObject);
	for(var i in keys) {
		temp.push(keys[i] + "=" + dataObject[keys[i]]);
	}
	return temp.join('&');
}
export default formatQuery;