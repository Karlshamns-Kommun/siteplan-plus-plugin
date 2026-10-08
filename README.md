# Siteplan Plus plugin

Origo plugin that post-processes the Origo **print** control. Allows configuring the print settings:

* Hide diffrent print options
* Change labels / placesholders without going through lang files.
* Allows modification of header input type.
* Allows slight size adjustment of scalebar text

The purpose of this plugin is to allow a "Siteplan Plus" instance of Origo. Such instance would be configured with layers specially designed for details related to parcel sites. Users can print a siteplan for a specific parcel with uniform print settings.

The plugin does not replace the print control, it adjusts the rendered settings panel every time the print preview is opened.

The plugin experience is based on Tomtkarta-Plus from Haninge kommun. The intention with this plugin is to allow a standard Origo-instance to run as a Siteplan-plus as well.

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
        printScaleBarFontSize: 16,
        printScaleBarRatioFontSize: 20,
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

Both initialization styles are supported. The example above uses the component
style: `SiteplanPlus(options)` returns a component that you attach with
`viewer.addComponent(siteplanPlus)`.

Alternatively, pass the viewer first to attach the component automatically:

```javascript
var siteplanPlus = SiteplanPlus(viewer, {
  headerLabel: 'Fastighetsbeteckning',
  printScaleBarFontSize: 16,
  printScaleBarRatioFontSize: 20
});
```

Both forms return the component. Do not call `viewer.addComponent` again when
using `SiteplanPlus(viewer, options)`.

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
| `printScaleBarFontSize` | number | *origo default* | Positive font size in pixels at 150 DPI for the print scalebar's ratio and distance labels. Scales with print DPI. Omit to preserve Origo's defaults; invalid values are ignored. |
| `printScaleBarRatioFontSize` | number | `printScaleBarFontSize`, otherwise *origo default* | Positive font size in pixels at 150 DPI for the top ratio only (for example, 1:500). Overrides the shared font size for that label and scales with print DPI. Invalid values are ignored. |
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

## Print Layout

The plugin adds the selected paper format, such as `Utskriftsformat: A4`, above
the date in the bottom-right print footer. It starts with the print control's
`sizeInitial` option (default `a4`), updates when the paper size changes, and is
included in the exported PDF and PNG. The format label remains visible if the
date is hidden. The footer's left and right padding classes are removed so its
content aligns with the map edges.

To enlarge the top ratio independently of the bottom distance labels, use
`printScaleBarFontSize: 16` and `printScaleBarRatioFontSize: 20`. Supply numbers,
not strings such as `'20px'`. Include the plugin stylesheet for these font-size
options to take effect. Omitting both options preserves Origo's default sizes.

## Development

```
npm install
npm start     # builds to ../origo/plugins
npm run build # builds to ./build
```
