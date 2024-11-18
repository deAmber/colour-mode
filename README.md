# colour-mode

`colour-mode` is a lightweight JavaScript library for managing website colour modes (light/dark) and contrast settings (normal/high contrast). It provides accessible, user-friendly functionality to dynamically adapt the UI based on user preferences or browser defaults.

## Features

- Detects and applies browser preferences for colour modes (`light` or `dark`) and contrast modes (`normal` or `high contrast`).
- Persists user preferences using `localStorage`.
- Dynamically updates `body` classes to reflect the selected modes.
- Supports real-time updates for new settings via a custom event (`SiteColourChange`).
- Handles image updates using `data-*` attributes based on the current mode.

## Getting Started

### Installation

Include the `colour-mode` script in your project as high in the head tag as you can, this script should be executed as early as possible to ensure no colour flash as modes change on load.

For optimal performance, host the colour-mode.js file locally to reduce dependency on external resources.
```html
<script src="path/to/colour-mode.js"></script>
```

For extra performance, include the follow script at the top of your body.
```html
  <body>
    <script>
        if (window.siteColourMode.lightMode) {
            document.body.classList.add('lightMode');
        } else if (window.siteColourMode.darkMode) {
            document.body.classList.add('darkMode');
        }
        if (window.siteColourMode.normalContrastMode) {
            document.body.classList.add('normalContrastMode');
        } else if (window.siteColourMode.highContrastMode) {
            document.body.classList.add('highContrastMode');
        }
    </script>
```
The inline script ensures colour and contrast modes are applied immediately after the document starts rendering, minimizing visual discrepancies during page load.

## Usage

The library automatically detects user or browser settings and applies the appropriate colour and contrast modes.

### Switching Modes
Use the handleColourModeChange function to switch between modes programmatically:
```javascript
// Switch to dark mode
handleColourModeChange('darkMode');

// Switch to light mode
handleColourModeChange('lightMode');

// Switch to browser defaults
handleColourModeChange('browserDefaultColour');

// Enable high contrast mode
handleColourModeChange('highContrastMode');

// Enable normal contrast mode
handleColourModeChange('normalContrastMode');

// Reset contrast to browser defaults
handleColourModeChange('browserDefaultContrast');
```

### Listening for Mode changes
Listen for the SiteColourChange custom event to respond to changes dynamically:
```javascript
window.addEventListener('SiteColourChange', (event) => {
  console.log('Colour mode changed to:', event.detail.colour);
});
```

### Updating Images
The library automatically swaps image src attributes during SiteColourChange. Set the appropriate image src for each mode using `data-*` attributes:
```html
<img 
  src="light-image.png"
  data-default-src="light-image.png"
  data-darkmode-src="dark-image.png" 
  data-darkmode-contrast-src="dark-high-contrast-image.png" 
  data-lightmode-contrast-src="light-high-contrast-image.png" 
  >
```
If a specific mode's `data-*` attribute is not provided, the library falls back to the `data-default-src`. If data-default-src is not set, then no colour change will occur.

### Styling
This library sets the appropriate colour mode as a class on the body tag.
- `lightMode`
- `darkMode`
- `highContrastMode`
- `normalContrastMode`

These classes can be styled in your CSS to match your design system, and provide specific overrides per colour mode.

You can target both specific classes and media queries in CSS, or use them to change variable values. See `cssVariables.css` for a better example of changing a single CSS variable based on the colour mode.
```css
/*Light mode*/
body, body.lightMode {
  --background-default: navy;
}
/*Dark mode*/
@media (prefers-color-scheme: dark) {
    body:not(.lightMode) {
        --background-default: antiquewhite;
    }
}
body.darkMode {
    --background-default: antiquewhite;
}
```

## Contributing
Contributions are welcome! If you’d like to report an issue, suggest a feature, or submit a pull request, please visit the repository.

## License
This project is licensed under the MIT License. See the LICENSE file for details.