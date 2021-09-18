const axios = require("axios").default;
const getFmSimilarUrl = ({artist, track}) => `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artist}&track=${track}&api_key=b9bdcb708a805b6ce1222f2c88ff7ea7&format=json`
const getOptions = (genre) =>  ({
  method: 'GET',
  url: 'https://shazam.p.rapidapi.com/search',
  params: {term: genre, locale: 'en-US', offset: '0', limit: '20'},
  headers: {
    'x-rapidapi-host': 'shazam.p.rapidapi.com',
    'x-rapidapi-key': '978ff0b408msh18526c0de87c0ebp17a04ajsn7b0e01b7abbe'
  }
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const getIds = ({data}) => data.items.map(({id}) => id.videoId);
const getYoutubeIds = (queryString) => axios(`https://www.googleapis.com/youtube/v3/search/?key=AIzaSyCABvhcklfjrj-v5KaA5ype6JtWiCWGy8s&q=${queryString}`).then(getIds);

exports.handler = async (event) => {
  const userGenre = event.path.split('/').pop();
  const {data} = await axios.request(getOptions(userGenre)).catch(console.error);
  const matches = data.tracks.hits.map(({track}) => {
    return {track: track.title.split(' ').join(''), artist: track.subtitle.split(' ').join('')}
  })
  const fmUrl = getFmSimilarUrl(matches[1]);
  console.log('fm URL is: ', fmUrl)
  const fmRecsResponse = await axios.request(fmUrl).catch(console.error);
  const fmRecs = fmRecsResponse.data;
  const tracks = fmRecs.similartracks.track;
  const randomInt = getRandomInt(tracks.length -1);
  const randomTrack = tracks[randomInt]
  const songName = `${randomTrack.name}-${randomTrack.artist.name}`;
  const ids = await getYoutubeIds(songName);
  return {
    statusCode: 200,
    body: ids[0]
  }
}