$(document).ready(function() {
    createInfoBox();
    let vanGoghArtworks = [];

    $('#fetch-another').click(function() {
        fetchRandomArtwork();
    });

    // Initial fetch to get all artworks by Vincent van Gogh
    $.get('https://collectionapi.metmuseum.org/public/collection/v1/search?q=Vincent van Gogh', function(data) {
        vanGoghArtworks = data.objectIDs;
        fetchRandomArtwork();
    });

    function fetchRandomArtwork() {
        let randomIndex = Math.floor(Math.random() * vanGoghArtworks.length);
        let randomObjectID = vanGoghArtworks[randomIndex];
        fetchArtworkDetails(randomObjectID);
    }

    function fetchArtworkDetails(objectID) {
        let detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;
        
        $.get(detailUrl, function(artwork) {
            if (artwork.primaryImageSmall) {
                $('#artwork-image').attr('src', artwork.primaryImageSmall);
                $('#artwork-title').text(artwork.title);
                $('#artwork-artist').text(artwork.artistDisplayName);
                $('#artwork-date').text(artwork.objectDate);
                $('#artwork-medium').text(artwork.medium);
                $('#artwork-dimensions').text(artwork.dimensions);
                $('#artwork-url').attr('href', artwork.objectURL);
            } else {
                fetchRandomArtwork();
            }
        });
    }
});

function createInfoBox() {
    const infoBox = document.createElement('div');
    infoBox.id = 'infoBox';
    infoBox.innerHTML = `
        <h3>Created by Nathan Liu</h3>
        <p><a href="https://github.com/nateykliu/Frontend">View this project in Github</a></p>
    `;
    document.body.appendChild(infoBox);
}