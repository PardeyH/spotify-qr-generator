import image from 'qr-image';
import { writeFile } from 'fs';
import axios from 'axios';

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// removes all special characters except the ampersand 
function removeSpecialChars(str) {
  return str.replace(/[^a-zA-Z0-9&\s]/g, "");
}

function showReleaseYear(str) {
  return str.slice(0, 4); 
}

const getToken = async () => {
    try {
      const url = 'https://accounts.spotify.com/api/token';
   
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
      const data = {
        grant_type: 'client_credentials',
      };
      
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error; 
    }
  };

  async function getPlaylist(playlistId) {
    try {
      const token = await getToken();
      const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
      const headers = { 'Authorization': `Bearer ${token.access_token}` };
  
      let allTracks = [];
      let next = url;
  
      while (next) {
        const response = await axios.get(next, { headers });
        allTracks = allTracks.concat(response.data.items); // Combine tracks from all pages
        next = response.data.next; // Check for next page URL
      }
  
      return allTracks;
    } catch (error) {
      console.error('Error fetching playlist:', error);
      throw error;
    }
  }

  (async () => {
    
    try {
      const token = await getToken();
  
      console.log('Access Token:', token.access_token);
  
      const playlistId = process.env.PLAYLIST_ID; 
      const fields = 'tracks(artists[0].name,name,album.release_date,uri)';

      const playlistData = await getPlaylist(playlistId, { fields }); // Pass fields object

      for (const song of playlistData) {
        const artist = removeSpecialChars(song.track.artists[0].name);
        const title = removeSpecialChars(song.track.name);
        const releaseYear = showReleaseYear(song.track.album.release_date);
        const spotifyURL = song.track.uri;

        const songInfo = `Artist: ${artist}\nTitle: ${title}\nRelease Year: ${releaseYear}`;
  
        writeFile(`./songs/${artist}-${title}.txt`, songInfo, (err) => {
          if (err) throw err;
          console.log("Input saved: " + songInfo);
        });
  
        const qr_svg = image.imageSync(spotifyURL, { type: 'png' });
  
        writeFile(`./songs/${artist}-${title}.png`, qr_svg, (err) => {
          if (err) throw err;
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  })();