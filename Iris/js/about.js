const headline = document.querySelector(".Headline");
const tagline = document.querySelector(".Tagline");
const description = document.querySelector(".description");
const qna = document.querySelector(".qna");
const section = document.querySelector(".section");
const footer = document.querySelector(".footer-menu");

setTimeout(function () {
    window.scrollTo(0, 0); /* Set the scroll position to the top */

    headline.classList.add("visible");
    tagline.classList.add("visible");
    description.classList.add("visible");
    qna.classList.add("visible");
    section.classList.add("visible");
    footer.classList.add("visible");
}, 100);