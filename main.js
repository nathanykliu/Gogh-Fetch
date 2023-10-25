
$(document).ready(function() {
    createInfoBox();
    let randomArt = [];
    let $backToTopButton = $('#back-to-top');
    
    $('#fetch-another').click(function() {
        fetchRandomArtwork();
    });

    // initial fetch to get artworks
    $.get('https://collectionapi.metmuseum.org/public/collection/v1/search?q=Vincent_van_Gogh', function(data) {
        randomArt = data.objectIDs;
        fetchRandomArtwork();
    });

    function fetchRandomArtwork() {
        let randomIndex = Math.floor(Math.random() * randomArt.length);
        let randomObjectID = randomArt[randomIndex];
        fetchRandomArtworkDetails(randomObjectID);
        $('#random-artwork').show();
    }

    function fetchRandomArtworkDetails(objectID) {
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
    // Get the search button and input elements
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');


    searchBtn.addEventListener('click', function() {
        performSearch(searchInput);
    });

    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 13) {
            performSearch(searchInput);
        }
    });
    function performSearch(searchInput) {
        $('#random-artwork').hide();
        let searchQuery = searchInput.value.trim();

        if (searchQuery) {
            $.get(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchQuery}`, function(data) {
                randomArt = data.objectIDs;
                if (randomArt && randomArt.length > 0) {
                    // clear any previous artworks
                    $('#gallery').empty();
                    
                    // loop through the first 10 results or as many as there are
                    for (let i = 0; i < Math.min(20, randomArt.length); i++) {
                        fetchArtworkGalleryDetails(randomArt[i]);
                    }
                } else {
                    alert('No results found for your search query.');
                }
            });
        } else {
            alert('Please enter a search query.');
        }
    }

    function fetchArtworkGalleryDetails(objectID) {
        let detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;
        
        $.get(detailUrl, function(artwork) {
            if (artwork.primaryImageSmall) {
                // create a new div for each artwork
                let artworkDiv = $('<div>').addClass('artwork');
                artworkDiv.append($('<img>').attr('src', artwork.primaryImageSmall));
                artworkDiv.append($('<h2>').text(artwork.title));
                artworkDiv.append($('<p>').text(artwork.artistDisplayName));
                artworkDiv.append($('<p>').text(artwork.objectDate));
                artworkDiv.append($('<p>').text(artwork.medium));
                artworkDiv.append($('<p>').text(artwork.dimensions));
                artworkDiv.append($('<a>').attr('href', artwork.objectURL).text('View on MET'));

                // append the artwork to the gallery container
                $('#gallery').append(artworkDiv);
            }
        });

    }
    //back to top button at bottom left
    $backToTopButton.on('click', function() {
        $('html, body').animate({scrollTop: 0}, 500);  // 500ms animation speed
    });

    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 200) {  // Show button after scrolling 200px
            $backToTopButton.fadeIn();
        } else {
            $backToTopButton.fadeOut();
        }
    });

    //refreshing page on logo click
    $('img[alt="logo"]').on('click', function() {
        location.reload();
    });

    //info box at bottom right
    function createInfoBox() {
        const infoBox = document.createElement('div');
        infoBox.id = 'infoBox';
        infoBox.innerHTML = `
            <h3>Created by Nathan Liu</h3>
            <p><a href="https://github.com/nateykliu/Frontend">View this project in Github</a></p>
        `;
        document.body.appendChild(infoBox);
    }
});