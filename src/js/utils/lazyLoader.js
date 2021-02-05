export function libraryNeedsLoading (library) {
  if (!window.lazyLoaderWe) {
    window.lazyLoaderWe = [];
    return true;
  }
  return !window.lazyLoaderWe.contains(library);
}

export function lazyLoader (library) {
  if (!window.lazyLoaderWe) {
    window.lazyLoaderWe = [];
  }

  // Don't reload a library, they are global to the app
  if (window.lazyLoaderWe.includes(library)) {
    return new Promise((resolve) => {
      resolve(`${library} was already loaded`);
    });
  }

  switch (library) {
    case 'fontawesome':
      return new Promise((resolve) => {
        const linkElementForFontAwesome = document.createElement('link');
        linkElementForFontAwesome.rel = 'stylesheet';
        linkElementForFontAwesome.href = 'https://use.fontawesome.com/releases/v5.8.2/css/all.css';
        linkElementForFontAwesome.as = 'style';
        linkElementForFontAwesome.crossOrigin = 'anonymous';
        linkElementForFontAwesome.integrity = 'sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay';
        const firstExistingLink = document.getElementsByTagName('link')[0];
        firstExistingLink.parentNode.insertBefore(linkElementForFontAwesome, firstExistingLink);
        window.lazyLoaderWe.push(library);
        resolve(`${library} has been loaded`);
      });
    default:
      return new Promise((resolve) => {
        console.error(`${library} has not been configured, and did not load`);
        resolve(`${library} has not been configured, and did not load`);
      });
  }
}
