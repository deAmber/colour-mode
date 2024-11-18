//Sets colour modes to browser default if not override storage key present
if (!localStorage.getItem('colourMode')) {
  localStorage.setItem('colourMode', 'default');
}
if (!localStorage.getItem('contrastMode')) {
  localStorage.setItem('contrastMode', 'default');
}

//Accessible colour mode tracking
window.siteColourMode = {
  'darkMode': false,
  'lightMode': false,
  'highContrastMode': false,
  'normalContrastMode': false,
  'browserDefaultColour': true,
  'browserDefaultContrast': true,
}

//Set local storage options now, will test for browser settings and apply classes when DOM is loaded
//darkmode
if (localStorage.getItem('colourMode') !== 'default') {
  window.siteColourMode['browserDefaultColour'] = false;
  if (localStorage.getItem('colourMode') === 'lightMode') {
    window.siteColourMode['lightMode'] = true;
  } else if (localStorage.getItem('colourMode') === 'darkMode') {
    window.siteColourMode['darkMode'] = true;
  }
}
//contrast mode
if (localStorage.getItem('contrastMode') !== 'default') {
  window.siteColourMode['browserDefaultColour'] = false;
  if (localStorage.getItem('contrastMode') === 'highContrastMode') {
    window.siteColourMode['highContrastMode'] = true;
  } else if (localStorage.getItem('contrastMode') === 'normalContrastMode') {
    window.siteColourMode['normalContrastMode'] = true;
  }
}

//Set classes and variables with initial values. Won't run until document.body exists
const pageColourModeSetup = () => {
  //Dark mode
  //If not site-setting, apply the browser default colour
  if (localStorage.getItem('colourMode') === 'default') {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      window.siteColourMode['lightMode'] = true;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      window.siteColourMode['darkMode'] = true;
    }
  }
  //Add chosen colour mode class to the body
  if (window.siteColourMode['lightMode']) {
    document.body.classList.add('lightMode');
  } else if (window.siteColourMode['darkMode']) {
    document.body.classList.add('darkMode');
  }
  //contrast mode
  //If not site-setting, apply the browser default colour
  if (localStorage.getItem('contrastMode') === 'default') {
    if (window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches) {
      window.siteColourMode['highContrastMode'] = true;
    } else {
      window.siteColourMode['normalContrastMode'] = true;
    }
  }
  //Add chosen colour mode class to the body
  if (window.siteColourMode['highContrastMode']) {
    document.body.classList.add('highContrastMode');
  } else if (window.siteColourMode['normalContrastMode']) {
    document.body.classList.add('normalContrastMode');
  }
}
if (document.body) {
  pageColourModeSetup();
} else {
  //Sometimes runs before document.body is defined.
  document.addEventListener('DOMContentLoaded', function() {
    pageColourModeSetup();
  });
}

/**
 * Handles the basic logic for switching between the different colour modes.
 * @param {"lightMode"|"darkMode"|"browserDefaultColour"|"normalContrastMode"|"highContrastMode"|"browserDefaultContrast"} mode - The selected colour mode to switch to.
 */
const handleColourModeChange = (mode) => {
  const body = document.body;
  //Handle change
  if (mode.toLowerCase().indexOf('default') < 0) {
    body.classList.add(mode);
  }
  window.siteColourMode[mode] = true;
  switch (mode) {
    case 'lightMode':
      window.siteColourMode.browserDefaultColour = window.siteColourMode.darkMode = false;
      body.classList.remove('darkMode');
      localStorage.setItem('colourMode', mode);
      break;
    case 'darkMode':
      window.siteColourMode.browserDefaultColour = window.siteColourMode.lightMode = false;
      body.classList.remove('lightMode');
      localStorage.setItem('colourMode', mode);
      break;
    case 'browserDefaultColour':
      window.siteColourMode.darkMode = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      window.siteColourMode.lightMode = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
      window.siteColourMode.browserDefaultColour = true;
      localStorage.setItem('colourMode', 'default');
      body.classList.remove('darkMode', 'lightMode');
      body.classList.add(window.siteColourMode.lightMode ? 'lightMode' : 'darkMode');
      break;
    case 'normalContrastMode':
      window.siteColourMode.highContrastMode = window.siteColourMode.browserDefaultContrast = false;
      localStorage.setItem('contrastMode', mode);
      body.classList.remove('highContrastMode');
      break;
    case 'highContrastMode':
      window.siteColourMode.normalContrastMode = window.siteColourMode.browserDefaultContrast = false;
      localStorage.setItem('contrastMode', mode);
      body.classList.remove('normalContrastMode');
      break;
    case 'browserDefaultContrast':
      window.siteColourMode.highContrastMode = (window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches);
      window.siteColourMode.normalContrastMode = (window.matchMedia && !window.matchMedia('(prefers-contrast: more)').matches);
      window.siteColourMode.browserDefaultContrast = true;
      localStorage.setItem('contrastMode', 'default');
      body.classList.remove('highContrastMode', 'normalContrastMode');
      body.classList.add(window.siteColourMode.normalContrastMode ? 'normalContrastMode' : 'highContrastMode');
      break;
  }
  //Triggers a custom event for and custom extra changes that need to be made.
  dispatchEvent(new CustomEvent('SiteColourChange', {detail: {'colour': mode}}));
}
window['handleColourModeChange'] = handleColourModeChange;

/**
 * Adds listeners to watch for browser colour mode changes. Also triggers colour and contrast events so that custom event listeners can work.
 */
const browserChangeSetup = () => {
  //Triggers custom events for browser settings changes if default is selected.
  //Note: does not work in chrome - known issue (https://issues.chromium.org/issues/40642550)
  const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  colorSchemeQuery.addEventListener('change', () => {
    if (window.siteColourMode.browserDefaultColour) {
      handleColourModeChange('browserDefaultColour');
    }
  });
  const contrastSchemeQuery = window.matchMedia('(prefers-contrast: more)');
  contrastSchemeQuery.addEventListener('change', () => {
    if (window.siteColourMode.browserDefaultContrast) {
      handleColourModeChange('browserDefaultContrast')
    }
  });
  //Triggers initial page load custom colour switching logic.
  window.dispatchEvent(new CustomEvent('SiteColourChange', {detail: {'colour': window.siteColourMode.browserDefaultColour ? 'browserDefaultColour' : window.siteColourMode.lightMode ? 'lightMode' : 'darkMode'}}));
  window.dispatchEvent(new CustomEvent('SiteColourChange', {detail: {'colour': window.siteColourMode.browserDefaultContrast ? 'browserDefaultContrast' : window.siteColourMode.normalContrastMode ? 'normalContrastMode' : 'highContrastMode'}}));
}

//Waits for page to be ready before adding browser listeners.
if (document.readyState === 'loading') {
  // The document is still loading, wait for it to finish
  document.addEventListener('DOMContentLoaded', browserChangeSetup);
} else {
  // The document is already fully loaded, execute the callback immediately
  browserChangeSetup();
}

//On colour mode, change image sources using data-attributes
addEventListener('SiteColourChange', function() {
  //Checks if the required colour mode is set on the element, otherwise use the default img
  const getSrcUrl = (element, dark, highContrast) => {
    const attribute = `data-${dark ? 'darkmode' : 'lightmode'}${highContrast ? '-contrast' : ''}-src`;
    if (element.getAttribute(attribute)) {
      return attribute;
    }
    return 'data-default-src';
  }
  //Changes image with the default-src data attribute set.
  document.querySelectorAll('img[data-default-src]').forEach(el => {
    el.setAttribute('src', el.getAttribute(getSrcUrl(el, window.siteColourMode.darkMode, window.siteColourMode.highContrastMode)));
  });
});
