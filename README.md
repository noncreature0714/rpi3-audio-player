# rpi3-audio-player 
## Audio player for the Raspberry Pi 3 

Supports CLI use as well as a library in your Node.js project.

#This is a work in progress, so feel free to contribute :)

###Installation###

If [npm](npmjs.com) is installed:
> `npm install -g rpi3-audio-player`

Or, if you prefer local installation:
> `npm install rpi3-audio-player`

To use as a library, simply:

``` 
const player = require('rpi3-audio-player');
```

## CLI use

To use rpi3-audio player, audio tracks must be placed in the ~/Music directory...

> `rpi3-audio-player play` #will play music from ~/Music

Or pass the path of a single mp3 file:

> `rpi3-audio-player <path/to/file.mp3>`

rpi3-audio-player can also be passed the path of a directory with .mp3's inside it.

> `rpi3-audio-player <path/to/directory/with/*.mp3>`

##More features coming soon!