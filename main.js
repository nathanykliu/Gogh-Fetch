

$(function() {

    //mobile modal
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    if (isMobileDevice()) {
        var mobileModal = document.getElementById("mobileModal");
        var closeMobileModal = document.getElementsByClassName("close-mobile-modal")[0];

        mobileModal.style.display = "block";
    
        closeMobileModal.onclick = function(event) {
            event.stopPropagation();
            closeMobileModal.style.display = "none";
            mobileModal.style.display = "none";
        }
    }

    // declare global variables
    createInfoBox();
    let randomArt = [];
    let $backToTopButton = $('#back-to-top');
    let modal = document.getElementById("modal");

    // fetch me another button functionality
    $('#fetch-another').on("click", function() {
        let $this = $(this);
    
        // change button text and cursor to indicate loading ("wait cursor")
        $this.text('Searching...').css('cursor', 'wait');
        $('body').css('cursor', 'wait');
    
        fetchRandomArtwork()
            .then(function() {
                // restore the button text and cursor when the promise is resolved
                $this.text('Fetch Me Another!').css('cursor', '');
                $('body').css('cursor', ''); // restore the cursor for the body
            })
            
            .catch(function(error) {
                console.error("Error in fetchRandomArtwork:", error);
                // restore the button text and cursor in case of an error
                $this.text('Fetch Me Another!').css('cursor', '');
                $('body').css('cursor', '');
            });
    });

    // initial fetch to get artworks
    $.get('https://collectionapi.metmuseum.org/public/collection/v1/search?q=van_gogh', function(data) {
        randomArt = data.objectIDs;
        fetchRandomArtwork();
    });

    // initial fetch function (called above)
    function fetchRandomArtwork() {
        return new Promise((resolve, reject) => {

            let randomIndex = Math.floor(Math.random() * randomArt.length);
            let randomObjectID = randomArt[randomIndex];
    
            fetchRandomArtworkDetails(randomObjectID)
                .then((data) => {
                    resolve(data);
                    $('#random-artwork').show();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function fetchRandomArtworkDetails(objectID) {
        let detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;
    
        return $.get(detailUrl)
        .done(function(artwork) {
            if (artwork.primaryImageSmall) {
                
                // applying details
  
                // update using .data() to keep the jquery data store in sync
                $('.tell-me-more-btn').data('artwork', artwork.title);
                $('.tell-me-more-btn').data('artworkArtist', artwork.artistDisplayName || 'Unknown Artist');
        
                $('#artwork-image').attr('src', artwork.primaryImageSmall);
                $('#artwork-title').text(artwork.title);
      
                // unknown artist handling
                if (artwork.artistDisplayName === "") {
                    $('#artwork-artist').text('Unknown Artist, ' + artwork.objectDate);
                } else {
                    $('#artwork-artist').text(artwork.artistDisplayName + ', ');
                }

                // unknown date handling
                if (artwork.objectDate === "") {
                    $('#artwork-date').text('Unknown Date');
                } else {
                    $('#artwork-date').text(artwork.objectDate);
                }

                // append the rest of the artwork details
                $('#artwork-medium').text(artwork.medium + ', ');
                $('#artwork-dimensions').text(artwork.dimensions);
                $('#artwork-url').attr('href', artwork.objectURL);
                $('')
                console.log(artwork);
                console.log("Artwork with primary image found!")
                
            } else {
                console.log("Artwork without primary image found. Searching again...");
                fetchRandomArtwork();
            }

        })
        
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error("Error fetching artwork:", textStatus, errorThrown);
                
                // error handling
                if (jqXHR.status === 404) {
                    console.log("404 error encountered. Searching for another artwork...");
                    fetchRandomArtwork();
                } else {
                    alert('Failed to fetch the artwork details. Please try again later.');
                }
            });
    }

    // event handling for chatGPT magic button 
    $('#random-artwork').on('click', '.tell-me-more-btn', function() {
        const artworkTitle = $(this).data('artwork');
        const artworkArtist = $(this).data('artworkArtist'); // jquery normalizes this to lowercase 
        getArtworkInfoFromChatGPT(artworkTitle, artworkArtist);
        $('#infoModalTitle').text(artworkTitle);
        $('#infoModal').css('display', 'block');
    });
    
    // close button  
    $(document).on('click', '.close', function() {
        $('#infoModal').css('display', 'none');
    });
    
    // chatGPT magic button API call
    async function getArtworkInfoFromChatGPT(artworkTitle, artworkArtist) {
        console.log("Requesting info for:", artworkTitle, "by", artworkArtist);
        try {
            const response = await fetch("/api/get-artwork-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title: artworkTitle, artist: artworkArtist })
            });
        
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log("Received response:", data);
    
            $('#infoModalTitle').text(artworkTitle);
            $('#infoModalContent').html(`"${artworkTitle}" by ${artworkArtist}: <p>${data.text}</p>`);
    

            $('#infoModal').css('display', 'block');
        } catch (error) {
            console.error("Error fetching information from server: ", error);
            $('#infoModalContent').html(`<p>Sorry, we couldn't fetch more information about this artwork. If you think you've encountered an error, please report it using the link on the bottom right of this page.</p>`);
        }
    }

    // share button
    $(document).on('click', '.share-btn', function() {
        $('#shareModal').show();
    });

    $(document).on('click', '.shareModalclose', function() {
        $('#shareModal').hide();
    });

    $(document).on('click', '.modal-content', function(event) {
        event.stopPropagation();
    });

    $(window).on('click', function(event) {
        if ($(event.target).is('#shareModal')) {
            $('#shareModal').hide();
        }
    });

    $(document).on('click', '.social-link', function(event) {
        event.preventDefault();
        const platform = $(this).data('platform');
        const metMuseumUrl = $('#artwork-url').attr('href')
        let shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(metMuseumUrl)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(metMuseumUrl)}`;
                break;
            case 'pinterest':
                shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(metMuseumUrl)}`;
                break;
        }
        window.open(shareUrl, '_blank');
    });

    // get the search button and input elements
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    // adding event listeners for clicking (also pressing enter) on the search button
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput);
    });

    searchInput.addEventListener('keyup', function(event) {
        if (event.key === "Enter") {
            performSearch(searchInput);
        }
    });

    //  perform search for artwork using MET API
    function performSearch(searchInput) {
        let searchQuery = searchInput.value.trim();

        if (searchQuery) {
            $('#random-artwork').hide();
            $.get(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchQuery}`, function(data) {
                randomArt = data.objectIDs;
                if (randomArt && randomArt.length > 0) {
                    // clear any previous artworks
                    $('#gallery').empty();
                    
                    // loop through the first 50 results
                    for (let i = 0; i < Math.min(50, randomArt.length); i++) {
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

    // display details of the gallery artwork
    function fetchArtworkGalleryDetails(objectID) {
        let detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;
        
        $.get(detailUrl, function(artwork) {
            if (artwork.primaryImageSmall) {
                // create a new div for each artwork
                let artworkDiv = $('<div>').addClass('artwork');
                artworkDiv.append($('<img>').attr('src', artwork.primaryImageSmall).addClass('artwork-image'));
                artworkDiv.append($('<h2>').text(artwork.title));
                $('#show-random').show();
        
                // add artist and date on the same line
                let artistAndDate = $('<p>');

                //unknown artist handling
                if (artwork.artistDisplayName === "") {
                    artistAndDate.append($('<span>').attr('id', 'artwork-artist').text('Unknown Artist, '));
                } else {
                    artistAndDate.append($('<span>').attr('id', 'artwork-artist').text(artwork.artistDisplayName + ', '));
                }

                //unknown date handling
                if (artwork.objectDate === "") {
                    artistAndDate.append($('<span>').attr('id', 'artwork-date').text('Unknown Date'));
                } else {
                artistAndDate.append($('<span>').attr('id', 'artwork-date').text(artwork.objectDate));
                }

                artworkDiv.append(artistAndDate);
        
                // add medium and dimensions on another line
                let mediumAndDimensions = $('<p>');
                mediumAndDimensions.append($('<span>').attr('id', 'artwork-medium').text(artwork.medium + ', '));

                mediumAndDimensions.append($('<span>').attr('id', 'artwork-dimensions').text(artwork.dimensions));
                artworkDiv.append(mediumAndDimensions);
        
                artworkDiv.append($('<a>').attr('href', artwork.objectURL).addClass('met-link').text('View on MET'));
                // append the artwork to the gallery container
                $('#gallery').append(artworkDiv);

            }
        });
    }

    // go to top button at bottom left
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
    
    // info box at bottom right
    function createInfoBox() {
        const infoBox = document.createElement('div');
        infoBox.id = 'infoBox';
        infoBox.innerHTML = `
            <h3>Created by Nathan Liu</h3>
            <p><a target = "_blank" href="https://github.com/nathanykliu/Gogh-Fetch">View this project in GitHub</a></p>
            <p><a target = "_blank" href ="https://github.com/nathanykliu/Gogh-Fetch/issues/new">Report a problem</a></p>
        `;
        document.body.appendChild(infoBox);
    }

    // light and dark mode toggle button logic
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
    let currentHighResSrc = "";
    let currentTitle = "";

    function setupDownloadButton() {
        $('#download-button').off('click').on('click', function(e) {
            e.preventDefault(); // prevent the default anchor behavior
            e.stopPropagation(); // prevent the click event from bubbling up to the modal
    
            fetch(`/api/image-proxy?url=${encodeURIComponent(currentHighResSrc)}`)
                .then(response => response.blob())
                .then(blob => {
                    let blobUrl = window.URL.createObjectURL(blob);
                    let tempLink = document.createElement('a');
                    tempLink.href = blobUrl;
                    tempLink.setAttribute('download', `${currentTitle}.jpg`.replace(/[^a-zA-Z0-9 .)(-]/g, ''));
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                    window.URL.revokeObjectURL(blobUrl);
                })
                .catch(error => {
                    console.error(error);
                    console.log("Error downloading image - file size exceeds 4.5MB Payload Limit. Opened in new tab, please download manually")
                    window.open(currentHighResSrc, '_blank').focus();
                });
        });
    }

    setupDownloadButton();

    // modal and download
    $('#gallery, #random-artwork').on('click', 'img', function() {
        modal.style.display = "block";
        let newSrc = $(this).attr('src').replace("/web-large/", "/original/");
        modalImage.src = newSrc;
        currentHighResSrc = newSrc;
    
        let parentDiv = $(this).closest('.artwork');
        let downloadTitle = parentDiv.find('h2').text().trim();
        let downloadArtist = parentDiv.find('p').first().text().trim();
    
        // check if the click is from the random artwork section
        if ($(this).closest('#random-artwork').length) {
            downloadTitle = $('#artwork-title').text().trim();
            downloadArtist = $('#artwork-artist').text().trim();
        }
    
        // combine title and artist
        currentTitle = downloadTitle;
        if (downloadArtist) {
            currentTitle += ` - ${downloadArtist}`;
        }
    
        // delete non-allowed characters 
        currentTitle = currentTitle.replace(/[^a-zA-Z0-9 .)(-]/g, '');
    });

    // close the modal when the user clicks anywhere
    $('#modal').on("click", function() {
    $(this).css('display', 'none');
    $('#gallery img, #random-artwork img').show();
    });

    // preload high res images
    function preloadHighRes() {
        $('#gallery img, #random-artwork img').each(function() {
            const src = $(this).attr('src');
            if (src) {
                const highResSrc = src.replace("/web-large/", "/original/");
                const img = new Image();
                img.src = highResSrc;
            }
        });
    }

    preloadHighRes();

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
