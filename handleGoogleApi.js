const config = require('./config');
const {google} = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: config.apiKey
});

class HandleGoogleApi {

    getPlaylists = async () => {
        let req = {};

        let yt;
        try {
            yt = await youtube.playlists.list({
                part : 'snippet',
                channelId : config.channelId,
                maxResults : 50
            });
            req.youtubePlaylists = yt.data.items;

            let playlists = [];
            for(let i=0;i<yt.data.items.length;i++) {
                let found = false;

                for(let j=0;j<playlists.length;j++) {
                    if(playlists[j].id === yt.data.items[i].id) {
                        found = true;
                        break;
                    }
                }
                if(!found) {
                    playlists.push(yt.data.items[i].id);
                }
            }

            let playlistItems = await this.getPlaylistItems(playlists);
            if(playlistItems) {
                req.youtubePlaylistItems = playlistItems;
                //console.log(playlistItems);
                return req;
            }
        } catch (e) {
            console.log('Error fetching youtube playlists');
            //console.log(e);
            return e;
        }
    };

    getPlaylistItems = async (ids) => {
        let yt;
        let res = [];
        for(let i=0; i<ids.length;i++) {
            try {
                yt = await youtube.playlistItems.list({
                    part : 'snippet,id',
                    playlistId : ids[i],
                    maxResults : 50
                });
                res.push(yt.data.items);
            } catch (e) {
                console.log('Error fetching videos from youtube playlist');
                //console.log(e);
                return false;
            }
        }
        return res;
    };

    // Not used
    /*    getVideos = async (req, res, next) =>  {
            let yt;
            try {
                yt = await youtube.search.list({
                    part : 'snippet',
                    channelId : config.youtube.channelId,
                    maxResults : 50,
                    order : 'date'
                });
                req.youtubeMedia = yt.data.items;
                next();
            } catch (e) {
                console.log('Error fetching youtube videos');
            }
        };*/
}

module.exports = HandleGoogleApi;