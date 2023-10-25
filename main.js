createInfoBox();

//delay load
// setTimeout(function() {
//     alert("Welcome to the Map Project!");
// }, 100)

document.addEventListener("DOMContentLoaded", function() {
    var map = L.map('map').setView([37.623851, -122.212689], 10);
    
    // light mode (looks worse than dark mode)
    // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // }).addTo(map); // This adds the tile layer to the map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap  </a>&copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
    }).addTo(map);

    var initialContent = "<b>Hey there, welcome to bay.pot!</b><br>Click on this marker for more information!</b>" // On click popup content
    var clickedContent = "<b>Click on markers for more information!</b><br>These are some of the best meat & soup locations in the bay. Thanks to Trevor for trying them all with me!</b>" // On click popup content

    var marker1 = L.marker([37.728209, -122.264521]).addTo(map) //welcome Popup
    marker1.bindPopup(initialContent).openPopup();; // popup opens by default
    marker1.on('click', function() {
        marker1.bindPopup(clickedContent).openPopup();
    })

    var marker2 = L.marker([37.761234, -122.490753]).addTo(map);

    marker2.bindPopup(`
    <div style="font-size:14px;">
        <b>The Pots Hot Pot</b><br>
        Energetic locale featuring classic Chinese hot pot with meat & veggie options, plus dumplings.
    </div>
    <div class="gallery-container">
        <button class="prev-btn">&#10094;</button>
        <img class="gallery-img show-img" src="marker2.png" alt="Description of Image" width="310" height="220">
        <button class="next-btn">&#10095;</button>
    </div>
    `);
    
    var marker3 = L.marker([37.503153, -121.976584]).addTo(map); 
    marker3.bindPopup('<div style="font-size:14px;"><b>Hai Di Lao</b><br>High end chain featuring robotic servers and a diverse selection of meat and soup options.</div><br><img src="marker3.png" alt="Description of Image" width="310" height="178">');
    
    var marker4 = L.marker([37.972804, -122.038415]).addTo(map); 
    marker4.bindPopup('<div style="font-size:14px;"><b>Steamboat</b><br>Hot pot served along with sushi at a chill Chinese-Japanese eatery with decorative lanterns.</div><br><img src="marker4.png" alt="Description of Image" width="310" height="178">');

    // attribution Text (removed UA flag)
    map.attributionControl.setPrefix('Powered by Leaflet');

    //click on title to reset map to original position
    var titleContainer = document.querySelector('.title-container');
    titleContainer.addEventListener('click', function(){
    map.setView([37.623851, -122.212689], 10);
    });

    //gallery and scrolling features
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('arrow')) {
            const container = e.target.parentElement;
            const imgs = container.querySelectorAll('.gallery-img');
            const currentImg = container.querySelector('.show-img');
            let index = Array.from(imgs).indexOf(currentImg);
    
            if (e.target.classList.contains('arrow-right')) {
                index = (index + 1) % imgs.length;
            } else if (e.target.classList.contains('arrow-left')) {
                index = (index - 1 + imgs.length) % imgs.length;
            }
    
            currentImg.classList.remove('show-img');
            imgs[index].classList.add('show-img');
        }
    });
});

map.invalidateSize();

function createInfoBox() {
    const infoBox = document.createElement('div');
    infoBox.id = 'infoBox';
    infoBox.innerHTML = `
        <h3>Created by Nathan Liu</h3>
        <p><a href="https://github.com/nateykliu/mcsp-project-pixel-art-maker">View this project in Github</a></p>
    `;
    document.body.appendChild(infoBox);
}