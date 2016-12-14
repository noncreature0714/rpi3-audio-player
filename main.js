const os = require('os');
const fs = require('fs');
const spawn = require('child_process').spawn;

const ls = spawn('ls', ['-lh', '/home/pi']);
const pwd = spawn('pwd', []);


ls.stdout.on('data', (data) => {
	console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
	console.log(`child prcess exited with code ${code}`);
});

pwd.stdout.on('data', (data) => {
	console.log(`stdout: ${data}`);
});

pwd.on('close', (cat) => {
	console.log(`stdout: ${cat}`);
});
