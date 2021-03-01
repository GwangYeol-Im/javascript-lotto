export const $ = (selector, parentNode = document) => parentNode.querySelector(selector);
export const $$ = (selector, parentNode = document) => [...parentNode.querySelectorAll(selector)];

export const disable = (...elements) => {
  elements.forEach(element => {
    element.disabled = true;
  });
};

export const show = (...elements) => {
  elements.forEach(element => {
    element.style.display = 'block';
  });
};
