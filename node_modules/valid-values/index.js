const path = require('path');
const fs = require('fs');

const isArrayWithHowManyElements = (array, numElements) => {
	if(typeof array === 'array' || typeof array === 'Array' || array instanceof Array){
		return array.length === numElements;
	} else {
		return false;
	}
};

const isAString = (value) => {
	return typeof value === 'string' || value instanceof String;
}

const isFile = (ofType, atPath) => {
	if(isAString(atPath)){
		var value = path.extname(atPath) === ofType;
		console.log('File is ' + ofType + ': ' + value);
		return value;
	} else {
		console.log(atPath + ' is not a string! Exiting... ');
		process.exit('1');
	}
}

const isADirectory = (filePath) => {
	if(isAString(filePath)){
		var value = fs.lstatSync(filePath).isDirectory();
		console.log('Checking if ' + filePath + ' is directory: ' + value);
		return value;
	} else {
		console.log(filePath + ' is not a string! Exiting... ');
		process.exit('1');
	}
}


const isFileOrDirectory = (filePath) => {
	if(isAString(filePath)){
		var value = fs.existsSync(filePath);
		console.log('Checking if path is a file or directory: ' + value);
		return value;
	} else {
		console.log(filePath + ' is not a string! Exiting... ');
		process.exit('1');
	}
}

const isFoldOfAtLeastOne = (fileType, atPath) => {
	console.log('Checking if there are ' + fileType + ' in folder: ' + filePath);
	var isOne = false;
	if(isADirectory(atPath)){
		files = fs.readdirSync(atPath);
		console.log('Files are: ' + files);
		if (files.length > 0) {
			files.forEach(file => {
				if (isFile(fileType, file)) {
					isOne = true;
				}
			});
		} else {
			console.log('No files in the folder.');
			isOne = false;
		}
	} else {
		console.log(atPath + ' is not a directory.');
		isOne = false;
	}
	return isOne;
}

module.exports = {isArrayWithHowManyElements, isAString, isFile, isADirectory, isFileOrDirectory, isFoldOfAtLeastOne};
