// Get the flower icon element
const flowerIcon = document.querySelector('.bi-flower3');

// Add the 'rotate' class to the flower icon element
flowerIcon.classList.add('rotate');
let imageUrl = "https://source.unsplash.com/random/1920x1080/?iris%20flower";
if (screen.availHeight > screen.availWidth) {
    imageUrl = "https://source.unsplash.com/random/1080x1920/?iris%20flower";
}
const bgElement = document.getElementsByClassName("bg-image")[0];
let preloaderImg = document.createElement("img");
preloaderImg.src = imageUrl;
preloaderImg.addEventListener('load', (event) => {
    bgElement.style.backgroundImage = `url(${imageUrl})`;
    bgElement.classList.add('opacity');
    preloaderImg = null;
    setTimeout(function () {
        flowerIcon.classList.add('stop');
    }, 500);
});