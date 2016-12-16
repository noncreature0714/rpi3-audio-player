//NOTE: this is a work in progress!
/*The goal is to create a player as a child process, 
controllable from the parent process.*/

const os = require('os');
const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');


//TODO: list the mp3s in ./audio_tracks
//TODO: Read those filenames from stdout into an array.
//TODO: play the first file.

const omxplayer = spawn('omxplayer', ['./audio_tracks/bensound-dubstep.mp3']);

//NOTE: console stdin/out/err is for debug purposes atm.
omxplayer.stdout.on('data', (data) => {
	console.log(`${data}`);
});

omxplayer.stderr.on('data', (data) => {
	//TODO: catch and report errors
	console.log(`${data}`);
});

omxplayer.on('close', (code) => {
	//TODO: if omxplayer exits and there are no tracks, report.
	//TODO: if omxplayer exits and there is an array, loop over the array, and  play the next track
	//TODO: if omxplayer exits and there is only one song, loop.
	console.log(`omxplayer ended with code ${code}`);
});

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
