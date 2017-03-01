//NOTE: this is a work in progress!
/*The goal is to create a player as a child process,
controllable from the parent process.*/

const os = require('os');
const fs = require('fs');
const vv = require('valid-values');
const storage = require('node-persist');
const spawn = require('child_process').spawn;
const path = require('path');
const musicFolder = '/home/pi/Music';
var tracks = Array();//TODO: store paths to audio tracks, not the files themselves.
var trackDirectories = Array(); //NOTE: for future recursive functions.
var trackIndex = 0;
var currentTrack;
var numTracks = 0;
var warnMessage;
var debugMode = false;
var monoChannel = false;
var audioRoute = 1; //0=auto, 1=headphone, 2=HDMI
var volume;
var filePath = "s";

//TODO: use jackd to configure the audio to play out of the headphone jack or hdmi (use parameters to detemine behaviour.)

/* NOTE: use "amixer cset numid=3 1" to set audio to headphone jack,
 * use "amixer cset numid=3 2" to set audio to HDMI, or
 * "amixer cset numid=3 0" to set to automatic
 **/

process.on('notracks', () => {
	process.send('notracks');
});

process.on('reload', () => {

});



const isOneTrack = () => {
	return tracks.length === 1;
}

const isAtEndOfTracks = () => {
	return trackIndex === tracks.length-1;
}

const incrementTrackIndex = () => {
	//console.log('Incrementing trackIndex from "' + trackIndex++ + '" to "' + trackIndex + '.');
	//TODO: check if this is used anywhere.
	trackIndex;
}

const getTrackIndex = () => {
	//console.log('Getting track index: ' + trackIndex);
	return trackIndex;
}

const isTracksEmpty = () => {
	//var value = tracks.length === 0;
	//console.log('Checking if tracks array is empty: ' + value);
	//return value;
	return tracks.length === 0;
}

const isAString = (value) => {
	return typeof value === 'string' || value instanceof String;
}
/*
const isFile = (ofType, atPath) => {
	if(isAString(atPath)){
		var value = path.extname(atPath) === ofType;
		console.log('File is ' + ofType + ': ' + value);
		return value;
	} else {
		console.log(atPath + ' is not a string! Exiting... ');
		process.exit('1');
	}
}*/
/*
const isMp3File = (filePath) => {
	if(isAString(filePath)){
		//var value = path.extname(filePath) === '.mp3';
		//console.log('Checking if file is mp3: ' + value);
		//return value;
		return path.extname(filePath) === '.mp3';
	} else {
		console.log(filePath + ' is not a string! Exiting... ');
		process.exit('1');
	}

}*/

const isADirectory = (filePath) => {
	if(isAString(filePath)){
		//var value = fs.lstatSync(filePath).isDirectory();
		//console.log('Checking if ' + filePath + ' is directory: ' + value);
		//return value;
		return fs.lstatSync(filePath).isDirectory();
	} else {
		console.log(filePath + ' is not a string! Exiting... ');
		process.exit('1');
	}
}

const isFileOrDirectory = (filePath) => {
	if(isAString(filePath)){
		//var value = fs.existsSync(filePath);
		//console.log('Checking if path is a file or directory: ' + value);
		//return value;
		return fs.existsSync(filePath);
	} else {
		console.log(filePath + ' is not a string! Exiting... ');
		process.exit('1');
	}

}

const isVerifiedPathAndMp3FileTypeAt = (filePath) => {
	//var value = isFileOrDirectory(filePath) && isMp3File(filePath)
	//console.log('Checking if file path is good and is mp3: ' + value);
	//return value;
	return isFileOrDirectory(filepath) && isMp3Fil3(filePath);
}

const isFolderOfAtLeast1Mp3 = (filePath) => {
	//console.log('Checking if there are mp3s in folder: ' + filePath);
	var isOneMp3 = false;
	if(isADirectory(filePath)){
		files = fs.readdirSync(filePath);
		//console.log('Files are: ' + files);
		if (files.length > 0) {
			files.forEach(file => {
				if (vv.isFile('.mp3', file)) {
					isOneMp3 = true;
				}
			});
		} else {
			console.log('No files in the folder.');
			isOneMp3 = false;
		}
	} else {
		console.log(filePath + ' is not a directory.');
		isOneMp3 = false;
	}
	return isOneMp3;
}

const listTracks = () => {
	if(!tracks){
		console.log('There are no tracks!');
		return;
	} else {
		console.log('There are ' + tracks.length + ' playable tracks.');
		tracks.forEach(track => {
			console.log(track);
		});
	}
}

const validatePathUsable = (filePath) => {
	//TODO: complete
	return filePath;
}

const doesTrackAlreadyExist = (filepath) => {
	var isThere = false;
	if(tracks){
		tracks.forEach(track => {
			if(track === filePath){
				isThere === true;
			}
		})
	}
	return isThere;
}

const addOneTrackToTracks = (track) => {
	if(vv.isFile('.mp3', track)){
		tracks.push(track);
	}
}

const addFolderToTracks = (filePath)=> {
	if(isADirectory(filePath)){
		if(isFolderOfAtLeast1Mp3(filePath)){
			files = fs.readdirSync(filePath);
			//console.log('From folder: ' + filePath);
			//console.log('Attempting to add files: ' + files);
			files.forEach(file => {
				var track = path.join(filePath, file);
				//TODO: make sure path is good.
				addOneTrackToTracks(track);
			});
		} else {
			console.log(filePath + ' has no mp3s to add to tracks!');
		}
	} else {
		console.log(filePath + ' is not a directory!');
	}
}

const load = (fileOrFolder) => { //For persistent storage.
	//TODO: figure this out.
}

const getTracks = () => {
	addFolderToTracks(musicFolder);

	numTracks = tracks.length;
	if (isTracksEmpty()) {
		console.log('No tracks to play, place tracks into ~/Music.');
		process.exit('1');
	}
};

const getNextTrackFrom = (pathToTrack) => {
	//(!pathToTrack)? getTracks() : (isMp3File(pathToTrack))? addOneTrackToTracks(pathToTrack) : (isADirectory(pathToTrack))? addFolderToTracks(pathToTrack) : tracks = null;
	///*
	if (!pathToTrack) { //If argument is void, find tracks to play.
		getTracks();
	} else {
		(vv.isFile('.mp3', pathToTrack))? doesTrackAlreadyExist(pathToTrack)? null : addOneTrackToTracks(pathToTrack) : (isADirectory(pathToTrack))? addFolderToTracks(pathToTrack) : tracks = null;
	}

	//addOneTrackToTracks(pathToTrack)
	//*/
	if(!tracks){
		console.log('Not tracks to play, exiting...');
		process.exit(1);
	} else {
		if(currentTrack){
			if (isOneTrack()) {//If there's only one track, keep playing it.
				console.log('Only one track to play, looping ' + currentTrack);
				trackIndex = 0;
				currentTrack = tracks[trackIndex];
			} else {
				(isAtEndOfTracks()) ? trackIndex = 0 : ++trackIndex;
				console.log('trackIndex is: ' + trackIndex);
				currentTrack = tracks[trackIndex];
			}
		} else {
			trackIndex = 0;
			currentTrack = tracks[trackIndex];
		}
	}
	return currentTrack;
};

const play = (pathToTrack) => {
	//TODO: if path to track is single file, play on loop.
	track = getNextTrackFrom(pathToTrack);
	console.log('From tracks: ' + tracks);
	console.log('Playing track: ' + track);
	const omxplayer = spawn('omxplayer', [track]);

	omxplayer.stdout.on('data', (data) => {
		console.log(`${data}`);
	});

	omxplayer.stderr.on('data', (data) => {
		//TODO: try to recover from recoverable errors.
		console.log(`Error(s): ${data}`);
	});

	omxplayer.on('close', (code) => {
		//console.log(`Child process ended with code ${code}`);
		if(code === 0){
			play(track);
		} else if (code === 1) {
			process.emitWarning('The was an unpermitted operation, attempting to restart.');
			play();
		}
		//TODO: add conditions for other error codes.
	});
}

//TODO: command line interpreter for cli only use.
//TODO: stop() function. (same as exit()).
//TODO: pauseOrResume() function.
//TODO: decrease speed function.
//TODO: increase speed function
//TODO: rewind() function
//TODO: showInfo() function
//TODO: previousAudioStream() function
//TODO: nextAudioStream() function
//TODO: previousChapter() function
//TODO: nextChapter() function
//TODO: exitOmxplayer() function (graceful exit)
//TODO: decreaseVolume() function
//TODO: increaseVolums() function
//TODO: seekBack30seconds() function(safe skip, checks to make sure that it won't skip past the beginning.
//TODO: seekAhead30Seconds() function (safe, makes sure to not skip past the end of the stream
//TODO: seekBack600seconds() (safe seek)
//TODO: seekAhead600seconds() (safe seek)
//TODO: add tracks function.
//TODO: set number of audio channels function (max is 2)
//TODO: set audio route function with amixer.

var myArgs = process.argv.slice(2);
if(myArgs.length === 0){
	console.log("Please enter a command, like 'play' or 'help'.");
}
var commands = Array();
var cliPath = Array();
myArgs.forEach((value, index) => {
	//TODO: figure out command list.
	switch(value){
		case "list":
			commands.push("list");
			break;
		case "play":
			commands.push("play");
			break;
		case "load":
			commands.push("load");
			break;
		case "help":
			commands.push("help");
			break;
		default:
			if(vv.isFile('.mp3', value)){
				cliPath.push(value);
			} else if(isFolderOfAtLeast1Mp3(value)){
				cliPath.push(value);
			} else {
				console.log('Not a known command, directory of mp3s, or mp3 file.');
			}
	}
});

commands.forEach((cmd) => {
	switch(cmd){
		case "list":
			//console.log('Listing avaiable tracks and exiting:');
			getTracks();
			listTracks();
			process.exit(0);
			break;
		case "play":
			console.log('Playing...');
			(cliPath)? play(cliPath[0]) : play();
			break;
		case "load":
			//TODO: this will be to add persistent data to player.
			console.log('Playing from file ' + cliPath[0]);
			play(cliPath[0]);
			break;
		case "help":
			console.log('Displaying help...');
			console.log('rpi3-audio-player only plays mp3 files.');
			console.log('');
			console.log('To play audio tracks, simply drag any ".mp3" files into Raspberry Pi\'s home Musc directory.');
			console.log('The path to the music directory is "~/Music" or "/home/pi/Music"');
			console.log('Then give rpi-audio-player the "play" command');
			console.log('')
			console.log('		rpi-audio-player play');
			console.log('');
			console.log('');
			console.log('A single file path to a director of mp3 or a path to a single file may also be passed to rpi3-audio-player.');
			console.log('Such as:');
			console.log('');
			console.log('		(Assuming Global Installation)');
			console.log('');
			console.log('		rpi3-audio-player <file.mp3 or folder>');
			console.log('');
			console.log('');
			console.log('And audio will begin playing from three sample tracks.');
			break;
		default:
			console.log('Unknown operation: ' + cmd);
			console.log('Use \'help\' for assistance!');
			console.log('');
			console.log('Example: 	rpi3-audio-player help');
			console.log('');
			break;
	}

});


module.exports = {play, listTracks};
