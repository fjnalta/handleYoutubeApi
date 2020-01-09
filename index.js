"use strict";

const config = require('./config');
const fs = require('fs');

const YoutubeVideos = require('./handleGoogleApi');
const youtubeVideos = new YoutubeVideos();

class App {
    constructor() {
        (async () => {
            await this.getYoutubeMedia();
        })();
    }

    getYoutubeMedia = async () => {
        let youtubeMedia = await youtubeVideos.getPlaylists();
        if(youtubeMedia) {
            // delete old file
            fs.unlink(config.outputPath, function () {
                console.log('file deleted');
            });
            // create new index
            let result = await youtubeVideos.getPlaylists();
            //console.log(result);
            fs.writeFileSync(config.outputPath,JSON.stringify(result));
            console.log('new Youtube Data written');
            return true;
        } else {
            console.log('Error updating youtube Media index');
            return false;
        }
    }
}

// Start App
const app = new App();

