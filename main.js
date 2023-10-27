

//main function
$(function() {

    //declare global variables
    createInfoBox();
    let randomArt = [];
    let $backToTopButton = $('#back-to-top');
    let modal = document.getElementById("modal");

    //fetch me another button functionality
    $('#fetch-another').on("click", function() {
        fetchRandomArtwork();
    });

    // initial fetch to get artworks
    $.get('https://collectionapi.metmuseum.org/public/collection/v1/search?q=van_gogh', function(data) {
        randomArt = data.objectIDs;
        fetchRandomArtwork();
    });

    //initial fetch function (called above)
    function fetchRandomArtwork() {
        let randomIndex = Math.floor(Math.random() * randomArt.length);
        let randomObjectID = randomArt[randomIndex];
        fetchRandomArtworkDetails(randomObjectID);
        $('#random-artwork').show();
    }

    function fetchRandomArtworkDetails(objectID) {
        let detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;
    
        $.get(detailUrl)
        .done(function(artwork) {
            if (artwork.primaryImageSmall) {
                $('#artwork-image').attr('src', artwork.primaryImageSmall);
                $('#artwork-title').text(artwork.title);
        
                // check if the artist name is present, if not, use "Unknown Artist"
                if (artwork.artistDisplayName === "") {
                    $('#artwork-artist').text('Unknown Artist');
                } else {
                    $('#artwork-artist').text(artwork.artistDisplayName);
                }
        
                $('#artwork-date').text(artwork.objectDate);
                $('#artwork-medium').text(artwork.medium);
                $('#artwork-dimensions').text(artwork.dimensions);
                $('#artwork-url').attr('href', artwork.objectURL);
                
                console.log(artwork);
                console.log("Artwork with primary image found!")
            } else {
                console.log("Artwork without primary image found. Searching again...");
                fetchRandomArtwork();
            }
        })
        
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error("Error fetching artwork:", textStatus, errorThrown);
                
                // 404 ERROR HANDLING/ OTHER ERROR HANDLING
                if (jqXHR.status === 404) {
                    console.log("404 error encountered. Searching for another artwork...");
                    fetchRandomArtwork();
                } else {
                    alert('Failed to fetch the artwork details. Please try again later.');
                }
            });
    }

    // get the search button and input elements
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    //adding event listeners for clicking (and pressing enter) on the search button
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput);
    });

    searchInput.addEventListener('keyup', function(event) {
        if (event.key === "Enter") {
            performSearch(searchInput);
        }
    });

    //perform search for artwork using MET API
    function performSearch(searchInput) {
        let searchQuery = searchInput.value.trim();

        if (searchQuery) {
            $('#random-artwork').hide();
            $.get(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchQuery}`, function(data) {
                randomArt = data.objectIDs;
                if (randomArt && randomArt.length > 0) {
                    // clear any previous artworks
                    $('#gallery').empty();
                    
                    // loop through the first 20 results or as many as there are
                    for (let i = 0; i < Math.min(20, randomArt.length); i++) {
                        fetchArtworkGalleryDetails(randomArt[i]);
                    }
    
                    // show the button only after fetching the gallery details
                    $('#show-random').show();
    
                } else {
                    alert('No results found for your search query.');
                    $('#show-random').hide();
                }
            });
        } else {
            alert('Please enter a search query.');
        }
        console.log("Search successful!")
    }

    //display details of the gallery artwork
    function fetchArtworkGalleryDetails(objectID) {
        let detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;
        
        $.get(detailUrl, function(artwork) {
            if (artwork.primaryImageSmall) {
                // create a new div for each artwork
                let artworkDiv = $('<div>').addClass('artwork');
                artworkDiv.append($('<img>').attr('src', artwork.primaryImageSmall));
                artworkDiv.append($('<h2>').text(artwork.title));
                $('#show-random').show();
        
                // add artist and date on the same line
                let artistAndDate = $('<p>');

                if (artwork.artistDisplayName === "") {
                    artistAndDate.append($('<span>').attr('id', 'artwork-artist').text('Unknown Artist, '));
                } else {
                    artistAndDate.append($('<span>').attr('id', 'artwork-artist').text(artwork.artistDisplayName));
                    artistAndDate.append(', ');
                }

                artistAndDate.append($('<span>').attr('id', 'artwork-date').text(artwork.objectDate));
                artworkDiv.append(artistAndDate);
        
                // add medium and dimensions on another line
                let mediumAndDimensions = $('<p>');
                mediumAndDimensions.append($('<span>').attr('id', 'artwork-medium').text(artwork.medium));
                mediumAndDimensions.append(', ');
                mediumAndDimensions.append($('<span>').attr('id', 'artwork-dimensions').text(artwork.dimensions));
                artworkDiv.append(mediumAndDimensions);
        
                artworkDiv.append($('<a>').attr('href', artwork.objectURL).addClass('met-link').text('View on MET'));
                // append the artwork to the gallery container
                $('#gallery').append(artworkDiv);
            }
        });
    }

    //go to top button at bottom left
    $backToTopButton.on('click', function() {
        $('html, body').animate({scrollTop: 0}, 750);  // animation speed back to the top
    });

    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 200) {  // show "go to top" button after scrolling 200px
            $backToTopButton.fadeIn();
        } else {
            $backToTopButton.fadeOut();
        }
    });

    $('#logo').on('click', function() {
        location.reload();
    });
    

    //info box at bottom right
    function createInfoBox() {
        const infoBox = document.createElement('div');
        infoBox.id = 'infoBox';
        infoBox.innerHTML = `
            <h3>Created by Nathan Liu</h3>
            <p><a target = "_blank" href="https://github.com/nateykliu/Frontend">View this project in Github</a></p>
            <p><a target = "_blank" href ="https://github.com/nateykliu/Gogh-Fetch/issues/new">Report a bug</a></p>
        `;
        document.body.appendChild(infoBox);
    }

    //light and dark mode toggle button logic
    document.querySelector("#theme-toggle-checkbox").addEventListener("change", function() {
        let currentTheme = document.documentElement.getAttribute("data-theme");
        if (currentTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
        } console.log("Theme toggled!");
    });

    // modal image viewer logic
    let modalImage = document.getElementById("modal-image");
    $('#gallery, #random-artwork').on('click', 'img', function() {
    $(this).show(); // toggle switch to hide background when modal is clicked, I can't decide yet...
    modal.style.display = "block";
    let newSrc = $(this).attr('src').replace("PrimaryImageSmall", "PrimaryImage");
    modalImage.src = newSrc;
    });

    // close the modal when the user clicks anywhere
    $('#modal').on("click", function() {
    $(this).css('display', 'none');
    $('#gallery img, #random-artwork img').show();
    });

    //music button logic
    const audioPlayer = document.getElementById("audioPlayer");
    const musicBtn = document.getElementById("musicBtn");

    musicBtn.addEventListener("click", function() {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
    });

});
