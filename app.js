let controller;
let slideScene;

function animateSlides() {
  // init Controller
  controller = new ScrollMagic.Controller();
  // select slides
  const slides = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");
  // loop over each slide
  slides.forEach((slide) => {
    const revealImg = slide.querySelector(".reveal-img");
    const revealText = slide.querySelector(".reveal-text");
    const img = slide.querySelector("img");

    //animation using GSAP
    const slideTl = gsap.timeline({ defaults: { duration: 1, ease: "power2inOut" } });
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    slideTl.fromTo(img, { scale: "2" }, { scale: "1" }, "-=1");
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");
  });
}

animateSlides();
