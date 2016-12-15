//NOTE: this is a work in progress!
/*The goal is to create a player as a child process, 
controllable from the parent process.*/

const os = require('os');
const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');


//TODO: list the mp3s in ~/Music
//TODO: Read those filenames from stdout into an array.
//TODO: play the first file.

const omxplayer = spawn('omxplayer', ['/home/pi/Music/bensound-dubstep.mp3']);

//NOTE: console stdin/out/err is for debug purposes atm.
omxplayer.stdout.on('data', (data) => {
	console.log(`${data}`);
});

omxplayer.stderr.on('data', (data) => {
	console.log(`${data}`);
});

omxplayer.on('close', (code) => {
	console.log(`omxplayer ended with code ${code}`);
});
