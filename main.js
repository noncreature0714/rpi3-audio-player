//NOTE: this is a work in progress!
/*The goal is to create a player as a child process, 
controllable from the parent process.*/

const os = require('os');
const fs = require('fs');
const storage = require('node-persist');
const spawn = require('child_process').spawn;
const path = require('path');
const musicFolder = '/home/pi/Music';
const audioTestFolder = './audio_test_tracks';
var tracks = Array();//TODO: store paths to audio tracks, not the files themselves.
var trackIndex = 0;
var currentTrack;
var numTracks = 0;
var warnMessage;
var monoChannel = false;
var audioRoute = 1; //0=auto, 1=headphone, 2=HDMI 
var volume;
var isTest = false;
var filePath = "s";

//TODO: play the first file.

//TODO: use jackd to configure the audio to play out of the headphone jack or hdmi (use parameters to detemine behaviour.)

/* NOTE: use "amixer cset numid=3 1" to set audio to headphone jack, 
 * use "amixer cset numid=3 2" to set audio to HDMI, or 
 * "amixer cset numid=3 0" to set to automatic
 **/

const incrementTrackIndex = () => {
	console.log('Incrementing trackIndex from "' + trackIndex++ + '" to "' + trackIndex + '.');
	trackIndex;
}

const getTrackIndex = () => {
	console.log('Getting track index: ' + trackIndex);
	return trackIndex;
}

const isTracksEmpty = () => {
	var value = tracks.length === 0;
	console.log('Checking if tracks array is empty: ' + value);
	return value;
}

const isMp3File = (filePath) => {
	var value = path.extname(filePath) === '.mp3';
	console.log('Checking if file is mp3: ' + value);
	return value;
}

const isOneTrack = () => {
	return tracks.length === 1;
}

const isAtEndOfTracks = () => {
	return trackIndex === tracks.length-1;
}

const isFileOrDirectory = (fileOrDirectory) => {
	var value = fs.existsSync(fileOrDirectory);
	console.log('Checking if path is a file or directory: ' + value);
	return value;
}

const isVerifiedPathAndMp3FileTypeAt = (filePath) => {
	var value = isFileOrDirectory(filePath) && isMp3File(filePath)
	console.log('Checking if file path is good and is mp3: ' + value);
	return value;
}

const isFolderOfMp3s = (folderPath) => {
	var areMp3Files = false;
	console.log('Checking if there are mp3s in folder: ' + folderPath);
	if(isFileOrDirectory(folderPath)){
		if(files = fs.readdirSync(folderPath)){
			if (!files.length === 0) {
			files.forEach(file => { 
				if (isMp3File(file)) {
					areMp3Files = true;
				}
			});
			} else {
				console.log('No files in the folder.');
			} 
		} else {
			areMp3Files = false;
		}
		
	} else {
		console.log(folderPath + ' is not a valid path or a folder name.');
	}
	return areMp3Files;
}

const listTracks = () => {
	if(!tracks){
		console.log('There are no tracks!');
		return;
	} else {
		console.log('There are ' + tracks.length + ' tracks.');
		tracks.forEach(track => {
			console.log(track);
		});
	}
}

const addOneTrackToTracks = (track) => {
	console.log('Attempting to add one tracks: ' + track);
	if(isMp3File(track)){
		tracks.push(track);
	}
}

const addFolderToTracks = (folder)=> {
	if(isFileOrDirectory(folder)){
		files = fs.readdirSync(folder);
	console.log('From folder: ' + folder);
	console.log('Attempting to add files: ' + files);
	files.forEach(file => {
		var track = path.join(folder, file);
		addOneTrackToTracks(track);
	});
	}
	
}



const load = (fileOrFolder) => { //For persistent storage.
	//TODO: figure this out.
} 

const getTracks = () => {
	if(isTest){
		addFolderToTracks(audioTestFolder);
	} else {
		addFolderToTracks(musicFolder);
	}

	numTracks = tracks.length;
	if (isTracksEmpty()) {
		console.log('No tracks to play, place tracks into ./audio_tracks or ~/Music.');
		console.log('Or use "test" to test functionality.')
		process.exit('1');
	}
};

const getNextTrackFrom = (pathToTrack) => {
	if (!pathToTrack) { //If argument is void, find tracks to play.
		getTracks();
	} else if (!isVerifiedPathAndMp3FileTypeAt(pathToTrack)){
		console.log('Not a valid path or not an mp3 file.');
		process.exit(1);
	} else if (isMp3File(pathToTrack) && !tracks){
		addOneTrackToTracks(pathToTrack);
	} else if (isFolderOfMp3s(pathToTrack)){
		addFolderToTracks(pathToTrack);
	}
	
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
	
	console.log('Track: ' + track);
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

//play();

const playTest = () => {
	isTest = true;
	getTracks();
	play();
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
const functionsDictionary = {
	"list": ()=>{getTracks();listTracks()}, 
	"load": (folder)=>{audioFolder = folder; console.log(`This changes how the applicaiton works, proceed with caution, or place audio in ~/Music!`)}, 
	"test": ()=>{const omxplayer = spawn('omxplayer', './audio_files/bensound-cute.mp3')},
	"play": (audioPath)=>{ play(audioPath)}
}

var myArgs = process.argv.slice(2);

myArgs.forEach((value, index) => {
	//TODO: figure out command list.
	isTest = false;
	switch(value){
		case "list":
			console.log('Listing avaiable tracks and exiting:');
			getTracks();
			listTracks();
			process.exit(0);
			break;
		case "play":
			console.log('Playing...');
			(myArgs[index+1]) ? play(myArgs[index+1]) : play();
			break;
		case "load":
			console.log('Folder loaded, playing...')
			play();
			break;
		case 'test':
			console.log('Testing 1, 2, 3...');
			playTest();
			break;
		default:
			console.log('Unknown operation: ' + value);
			break;
	}
});

//TODO: figure out exports.