export const songList = [
    {
        title: "Wanderer",
        artist: "The Intersphere",
        releaseYear: "2023",
        link: "https://open.spotify.com/intl-de/track/0jXMBOd2TWj9tfO9z9lbIx?si=51c5066e2d02440b"
    },
    {
        title: "Bulletproof",
        artist: "The Intersphere",
        releaseYear: "2023",
        link: "https://open.spotify.com/intl-de/track/4cVEXnR5muT7S5xtdi6kIK?si=475e731a62df4e2e"
    },
    {
        title: "Down",
        artist: "The Intersphere",
        releaseYear: "2023",
        link: "https://open.spotify.com/intl-de/track/71rjBJ4Grhpu9I9jkWUwWB?si=6e42e1a18e0242e4"
    },
]

const hitsterRockEdition = "https://open.spotify.com/playlist/7E4sNZ9e973TLIW9sBa5NG?si=506ded316a5543ab";

async function getPlaylist() {

    try {
        const response = await axios.get(env.SPOTIFY_API);
        const result = response.data;

        for (let i = 0; i < songs.length; i++) {

            const artist = songs.items[i].track.artists[0].name;
            console.log(artist);
            const title = songs.items[i].track.name;
            console.log(title);
            const releaseYear = songs.items[i].track.album.release_date;
            console.log(releaseYear);
            const spotifyURL = songs.items[i].track.uri;
            console.log(spotifyURL);
            
            const songInfo = 
            "Artist: " + artist + "\n" +
            "Title: " + title + "\n" + 
            "Release Year: " + releaseYear;
        
            writeFile(`./songs/${artist}-${title}.txt`, songInfo, (err) => {
                if (err) throw err;
                console.log("Input saved: " + songInfo);
            });
        
            var qr_svg = image.imageSync(spotifyURL);
        
            writeFile(`./songs/${artist}-${title}.png`, qr_svg, (err) => {
                if (err) throw err;
            });
        }
    } catch (error) {
        console.log(error);
    }
}
