let controller;
let slideScene;
let pageScene;
const mouse = document.querySelector(".cursor");
const mouseTxt = mouse.querySelector("span");
const burger = document.querySelector(".burger");
const logo = document.querySelector("#logo");

// event listeners
burger.addEventListener("click", navToggle);
window.addEventListener("mouseover", activeCursor);
window.addEventListener("mousemove", cursor);

function animateSlides() {
  // init Controller
  controller = new ScrollMagic.Controller();
  // select slides
  const slides = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");
  // loop over each slide
  slides.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const revealText = slide.querySelector(".reveal-text");
    const img = slide.querySelector("img");

    //animation using GSAP
    const slideTl = gsap.timeline({ defaults: { duration: 1, ease: "power2inOut" } });
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    slideTl.fromTo(img, { scale: "2" }, { scale: "1" }, "-=1");
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");

    //Create a Scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTl)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
      })
      .addTo(controller);
    //create page scene
    const pageT1 = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageT1.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageT1.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageT1.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0,
      duration: "100%",
    })
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "page",
        indent: 200,
      })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageT1)
      .addTo(controller);
  });
}

function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }

  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    mouseTxt.innerText = "tab";
    gsap.to(".title-swipe", 1, { y: "0%" });
  } else {
    mouse.classList.remove("explore-active");
    mouseTxt.innerText = "";
    gsap.to(".title-swipe", 1, { y: "100%" });
  }
}

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: 45, y: 5, background: "black" });
    gsap.to(".line2", 0.5, { rotate: -45, y: -5, background: "black" });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: 0, y: 0, background: "white" });
    gsap.to(".line2", 0.5, { rotate: 0, y: 0, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
    document.body.classList.remove("hide");
  }
}

// page transition
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy(), pageScene.destroy(), controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        gsap.fromTo(".nav-header", 1, { y: "100%" }, { y: "0%", ease: "power2.inOut" });
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        const t1 = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        t1.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        t1.fromTo(".swipe", 0.75, { x: "-100%" }, { x: "0%", onComplete: done }, "-=0.5");
      },
      enter({ current, next }) {
        window.scrollTo(0, 0);
        let done = this.async();
        const t1 = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        t1.fromTo(".swipe", 0.75, { x: "0%" }, { x: "100%", stagger: 0.5, onComplete: done });
        t1.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
      },
    },
  ],
});
