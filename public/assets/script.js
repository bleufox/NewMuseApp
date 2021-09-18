
    function buildTrack(id) {
        const responseOutput = document.getElementById('response-output')
        responseOutput.innerHTML = '';
        const iframeHtml = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        responseOutput.innerHTML=iframeHtml;
    }
    

    const fetchBtn = document.getElementById('fetch-songs')

    fetchBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        console.log('we are clicking on this button!');
        const userGenre = document.getElementById('genre').value;
        const songResponse = await axios.get(`/.netlify/functions/get-songs/${userGenre}`);
        const songId = songResponse.data;
        console.log('we got these songs: ', songResponse);
        buildTrack(songId);
    });