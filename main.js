const os = require('os');
const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');


const pwd = spawn('pwd', []);
var localpath = "/home/pi/Music/"
//console.log("Path to Music is: " + localpath);
const ls = spawn('ls', ['-lh', '/home/pi/Music']);

//TODO: list the mp3s in ~/Music
//TODO: Read those filenames from stdout into an array.
//TODO: play the first file.

ls.stdout.on('data', (data) => {
	console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
	console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
	console.log(`"ls" exited with code ${code}`);
});

//localpath = localpath + "bensound-dubstep.mp3";
const omxplayer = spawn('omxplayer', ['/home/pi/Music/bensound-dubstep.mp3']);

/*
pwd.stdout.on('data', (data) => {
	console.log(`stdout: ${data}`);
});

pwd.on('close', (cat) => {
	console.log(`stdout: ${cat}`);
});
*/

omxplayer.stdout.on('data', (data) => {
	console.log(`${data}`);
});

omxplayer.stderr.on('data', (data) => {
	console.log(`${data}`);
});

omxplayer.on('close', (code) => {
	console.log(`omxplayer ended with code ${code}`);
});
