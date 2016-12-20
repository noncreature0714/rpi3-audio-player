//NOTE: this is a work in progress!
/*The goal is to create a player as a child process, 
controllable from the parent process.*/

const os = require('os');
const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');
const audioFolder = './audio_tracks';
const musicFolder = '/home/pi/Music';
var tracks = Array();//TODO: store paths to audio tracks, not the files themselves.
var trackIndex = 0;
var currentTrack;
var numTracks = 0;
var warnMessage;
//TODO: play the first file.

//TODO: use jackd to configure the audio to play out of the headphone jack or hdmi (use parameters to detemine behaviour.)

/* NOTE: use "amixer cset numid=3 1" to set audio to headphone jack, 
 * use "amixer cset numid=3 2" to set audio to HDMI, or 
 * "amixer cset numid=3 0" to set to automatic
 **/

const listTracks = () => {
	console.log('listTracks() called, listing tracks')
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

const findTracks = () => {
	console.log('findTracks function called.');
	var index = 0;

	files = fs.readdirSync(audioFolder);
	files.forEach(file => {
		tracks.push('./' + path.join(audioFolder, file));
		//console.log('From findTracks(), the file path of track ' + index + ' is: ' + tracks[index]);
		 index += 1;
	});
	
	if (tracks.length === 0) {
		console.log('No tracks in "./audio_tracks"');
		files = fs.readdirSync(musicFolder);
		files.forEach(file => {
			tracks.push('./' + path.join(musicFolder, file));
			//console.log('From findTracks(), the file path of track ' + index + ' is: ' + tracks[index]);
			index += 1;
		});
	}
	numTracks = tracks.length;
	if (tracks.length === 0) {
		console.log('No tracks to play, place tracks into ./audio_tracks or ~/Music.');
	}
};

//findTracks();

const isVerifiedPathAndMp3FileTypeAt = (filePath) => {
	var isGood = true;
	if (!filePath) { //If argument is void, find tracks to play.
		findTracks();
	} else if (fs.existsSync(filePath)) { //If the argument is a valid path, then...
		if (path.extname(filePath) !== '.mp3') {
			warnMessage = 'Invalid file type, rpi3-audio-player only plays mp3 files. Exiting...';
			isGood = false;
		} else {
			currentTrack = filePath;
			isGood = true;
		}
	} else {
		warnMessage = 'Invalid file path! Exiting... ';
		isGood = false;
	}
	return isGood;
}
	

const getNextTrackFrom = (pathToTrack) => {
	if (!pathToTrack) { //If argument is void, find tracks to play.
		findTracks();
	} else if (!isVerifiedPathAndMp3FileTypeAt(pathToTrack)){
		process.emitWarning(warnMessage);
		process.abort();
	}
	
	if(!tracks){
		process.emitWarning('Not tracks to play, exiting...');
		process.abort();
	} else {
		if(currentTrack){
			if (tracks.length === 1) {//If there's only one track, keep playing it.
				process.emitWarning('Only one track to play, looping ' + currentTrack);
				trackIndex = 0;
				currentTrack = tracks[trackIndex];
			} else {
				if(trackIndex===tracks.length-1){
					trackIndex = 0;
				} else {
					++trackIndex;
				}
				currentTrack = tracks[trackIndex];
			}
		} else {
			trackIndex = 0;
			currentTrack = tracks[trackIndex];
		}
	}

	return currentTrack;	
};

//NOTE: console stdin/out/err is for debug purposes atm.
//console.log('spawning omxplayer globally.');
//const omxplayer = spawn('omxplayer', [currentTrack]);

const play = (pathToTrack) => {
	console.log('startPlayer function called.');
	
	track = getNextTrackFrom(pathToTrack);
	
	console.log('In startPlayer(), starting with track ' + track);
	console.log('spawning omxplayer as child_process.');
	const omxplayer = spawn('omxplayer', [track]);
	
	omxplayer.stdout.on('data', (data) => {
		console.log(`${data}`);
	});

	omxplayer.stderr.on('data', (data) => {
		//TODO: try to recover from recoverable errors.
		console.log(`Error(s): ${data}`);
	});


	omxplayer.on('close', (code) => {
		console.log(`omxplayer ended with code ${code}`);
		if(code === 0){
			play(track);
		}
		//TODO: add conditions for other error codes.
	});
}

play();

//TODO: command line interpreter for cli only use.
//TODO: play() function.
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
//TODO: check for tracks function.
//TODO: add tracks function.
//TODO: set number of audio channels function (max is 2)
//TODO: set audio route function with amixer.
