const carousel_images = document.querySelectorAll('.carousel_image');
const slider = document.querySelectorAll('.mobile')[0];
const buttons = document.querySelectorAll('.clickable_icon');

carousel_images.forEach((e) => (e.style.transition = '0s'));
carousel_images.forEach((e) => (e.style.transform = `translateX(${346}px)`));

buttons.forEach((e, index) =>
  e.addEventListener('click', (event) => {
    carousel_images.forEach((e) => (e.style.transition = '1s ease-in-out'));
    carousel_images.forEach(
      (e) => (e.style.transform = `translateX(${346 * (2 - (index + 1))}px)`)
    );
  })
);

// 345 0 -345
// carousel_images.forEach((e) => (e.style.transform = `translateX(-${0}px)`));
