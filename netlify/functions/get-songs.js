const axios = require("axios").default;
const getFmSimilarUrl = ({artist, track}) => `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artist}&track=${track}&api_key=b9bdcb708a805b6ce1222f2c88ff7ea7&format=json`
const getOptions = (ganre) =>  ({
  method: 'GET',
  url: 'https://shazam.p.rapidapi.com/search',
  params: {term: ganre, locale: 'en-US', offset: '0', limit: '20'},
  headers: {
    'x-rapidapi-host': 'shazam.p.rapidapi.com',
    'x-rapidapi-key': '978ff0b408msh18526c0de87c0ebp17a04ajsn7b0e01b7abbe'
  }
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

exports.handler = async (event) => {
  const userGanre = event.path.split('/').pop();
  const {data} = await axios.request(getOptions(userGanre)).catch(console.error);
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
  return {
    statusCode: 200,
    body: `${randomTrack.name}-${randomTrack.artist.name}`
  }
}