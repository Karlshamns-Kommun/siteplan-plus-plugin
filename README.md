# Siteplan Plus plugin

Origo plugin that post-processes the built in **print** control so the print settings
form can be reduced to a single header textbox and so individual settings can be hidden.

The plugin does not replace the print control, it adjusts the rendered settings panel
every time the print preview is opened.

## Usage

**index.html:**
```html
<head>
  <link href="css/style.css" rel="stylesheet">
  <link href="plugins/siteplanplus.css" rel="stylesheet">
</head>
<body>
  <div id="app-wrapper"></div>
  <script src="js/origo.js"></script>
  <script src="plugins/siteplanplus.js"></script>
  <script type="text/javascript">
    var origo = Origo('index.json');
    origo.on('load', function (viewer) {
      var siteplanPlus = SiteplanPlus({
        headerLabel: 'Fastighetsbeteckning',
        headerPlaceholder: 'Ange fastighetsbeteckning',
        headerPrefix: 'Situationsplan - ',
        headerMultiline: true,
        headerRows: 3,
        headerFormatDisabled: true,
        descriptionLabel: 'Beskrivning',
        descriptionPlaceholder: 'Ange beskrivning',
        hidePrintMapInteraction: true,
        titleDisabled: false,
        descriptionDisabled: true,
        sizeDisabled: true,
        orientationDisabled: true,
        resolutionDisabled: true,
        setScaleDisabled: true,
        showMarginsDisabled: true,
        showCreatedDisabled: true,
        showScaleDisabled: true,
        showNorthArrowDisabled: true,
        showLegendDisabled: true,
        rotationDisabled: true
      });
      viewer.addComponent(siteplanPlus);
    });
  </script>
</body>
```

The `print` control must be enabled in the map config for the plugin to have any effect.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `headerLabel` | string | *origo default* | Label shown above the header textbox. |
| `headerPlaceholder` | string | *origo default* | Placeholder text of the header textbox. |
| `headerPrefix` | string | `''` | Prepended to the printed header. Not shown when the textbox is empty. |
| `headerMultiline` | boolean | `false` | Renders the header field as a resizable textarea. Line breaks are kept in the printed header. |
| `headerRows` | number | `3` | Visible rows when `headerMultiline` is enabled. |
| `headerFormatDisabled` | boolean | `true` | Hides the `...` button with header alignment and size. |
| `descriptionLabel` | string | *origo default* | Label shown above the description field. |
| `descriptionPlaceholder` | string | *origo default* | Placeholder text of the description field. |
| `hidePrintMapInteraction` | boolean | `true` | Hides "change map position" in the print preview. |
| `titleDisabled` | boolean | `false` | Hides the header textbox entirely. |
| `descriptionDisabled` | boolean | `false` | Hides the description field. |
| `sizeDisabled` | boolean | `false` | Hides paper size and custom size. |
| `orientationDisabled` | boolean | `false` | Hides the orientation toggle. |
| `resolutionDisabled` | boolean | `false` | Hides the resolution toggle. |
| `setScaleDisabled` | boolean | `false` | Hides the print scale picker. |
| `showMarginsDisabled` | boolean | `false` | Hides the margins checkbox. |
| `showCreatedDisabled` | boolean | `false` | Hides the created date checkbox. |
| `showScaleDisabled` | boolean | `false` | Hides the show scale checkbox. |
| `showNorthArrowDisabled` | boolean | `false` | Hides the north arrow checkbox. |
| `showLegendDisabled` | boolean | `false` | Hides the legend checkbox. |
| `rotationDisabled` | boolean | `false` | Hides the map rotation slider. |

Hiding a control only removes it from the form; the corresponding print behaviour is
still controlled by the `print` control options in the map config (for example
`showNorthArrow`, `showScale`, `orientation`, `sizeInitial`, `scaleInitial`).

## Development

```
npm install
npm start     # builds to ../origo/plugins
npm run build # builds to ./build
```
