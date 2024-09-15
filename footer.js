// footer.js (or another suitable JavaScript file)

// Function to check if the user has scrolled to the bottom of the page
function isScrolledToBottom() {
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
}

// Function to toggle the info box visibility
function toggleInfoBox() {
    const infoBox = document.getElementById('info-box');
    if (document.getElementById('no-followback-list').children.length > 0) {
        // Show info box only if data is present and user has scrolled to the bottom
        infoBox.classList.toggle('visible', isScrolledToBottom());
    } else {
        // Hide info box if no data is present
        infoBox.classList.remove('visible');
    }
}

// Event listener to check scroll position on scroll event
window.addEventListener('scroll', toggleInfoBox);

// Call toggleInfoBox on initial page load
window.addEventListener('load', toggleInfoBox);
