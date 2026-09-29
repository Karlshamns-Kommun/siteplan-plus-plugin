import Origo from 'Origo';

/**
 * SiteplanPlus
 * Post-processes Origo's built in print control so that the print settings form
 * can be reduced to a single header textbox (with a configurable label,
 * placeholder and header prefix) and so that individual settings can be hidden.
 *
 * The plugin does not fork the print control, it only adjusts the rendered
 * settings panel every time the print preview is opened.
 */
const SiteplanPlus = function SiteplanPlus(options = {}) {
  const {
    headerLabel,
    headerPlaceholder,
    headerPrefix = '',
    headerMultiline = false,
    headerRows = 3,
    headerFormatDisabled = true,
    descriptionLabel,
    descriptionPlaceholder,
    hidePrintMapInteraction = true,
    orientationDisabled = false,
    sizeDisabled = false,
    setScaleDisabled = false,
    resolutionDisabled = false,
    showMarginsDisabled = false,
    showCreatedDisabled = false,
    showScaleDisabled = false,
    showNorthArrowDisabled = false,
    showLegendDisabled = false,
    titleDisabled = false,
    descriptionDisabled = false,
    rotationDisabled = false
  } = options;

  let viewer;
  let printComponent;
  let headerObserver;

  const hide = function hide(el) {
    if (el) el.style.display = 'none';
  };

  /** Direct children of the settings container, in render order. */
  const childrenOf = function childrenOf(el) {
    return Array.prototype.slice.call(el.children);
  };

  /**
   * Hides a heading and the elements that belong to it.
   * @param {Element[]} children direct children of the settings container
   * @param {Element} heading the h6 element that starts the section
   * @param {number} count number of elements after the heading to hide
   */
  const hideSection = function hideSection(children, heading, count) {
    if (!heading) return;
    const start = children.indexOf(heading);
    hide(heading);
    for (let i = 1; i <= count; i += 1) {
      hide(children[start + i]);
    }
  };

  /**
   * Swaps origo's single line header input for a textarea, keeping the id so the
   * rest of the print settings keep working.
   */
  const toTextarea = function toTextarea(inputEl) {
    const textarea = document.createElement('textarea');
    textarea.id = inputEl.id;
    textarea.className = inputEl.className;
    textarea.rows = headerRows;
    textarea.value = inputEl.value;
    textarea.style.cssText = inputEl.style.cssText;
    textarea.style.height = 'auto';
    textarea.style.resize = 'vertical';
    inputEl.replaceWith(textarea);
    return textarea;
  };

  /** Keeps the printed header in sync with the input value, prefixed. */
  const bindHeaderPrefix = function bindHeaderPrefix(printEl, inputEl) {
    const headerEl = printEl.querySelector('.o-print-header');
    if (!headerEl || !inputEl) return;
    const headerId = headerEl.id;
    const pageEl = headerEl.parentElement;

    const apply = function apply() {
      const el = document.getElementById(headerId);
      if (!el) return;
      const value = inputEl.value.trim();
      const desired = value ? `${headerPrefix}${value}` : '';
      // Guard against re-triggering the observer in an endless loop.
      if (el.textContent !== desired) el.textContent = desired;
      if (headerMultiline) el.style.whiteSpace = 'pre-wrap';
    };

    // A textarea has no origo listeners attached, so drive the header ourselves.
    inputEl.addEventListener('input', apply);

    if (headerObserver) headerObserver.disconnect();
    headerObserver = new MutationObserver(apply);
    headerObserver.observe(pageEl, { childList: true, subtree: true, characterData: true });
    apply();
  };

  const applySettings = function applySettings() {
    const printEl = document.getElementById(printComponent.getId());
    if (!printEl) return;

    const toolsEl = printEl.querySelector('#o-print-tools-left');
    if (hidePrintMapInteraction && toolsEl && toolsEl.children.length > 1) {
      hide(toolsEl.lastElementChild);
    }

    const settingsEl = printEl.querySelector('.no-print.overflow-auto.max-height-100');
    if (!settingsEl) return;

    const children = childrenOf(settingsEl);
    const headings = children.filter((el) => el.tagName === 'H6');
    // Render order: title, description, paper size, orientation, [resolution], print scale
    const titleHeading = headings[0];
    const descriptionHeading = headings[1];
    const sizeHeading = headings[2];
    const orientationHeading = headings[3];
    const hasResolution = headings.length > 5;
    const resolutionHeading = hasResolution ? headings[4] : undefined;
    const scaleHeading = headings[headings.length - 1];

    if (titleDisabled) {
      hideSection(children, titleHeading, 2);
    } else if (titleHeading) {
      const titleIdx = children.indexOf(titleHeading);
      const titleRow = children[titleIdx + 1];
      if (headerLabel !== undefined) titleHeading.textContent = headerLabel;
      let inputEl = titleRow ? titleRow.querySelector('input, textarea') : undefined;
      if (inputEl && headerMultiline && inputEl.tagName === 'INPUT') inputEl = toTextarea(inputEl);
      if (inputEl && headerPlaceholder !== undefined) inputEl.placeholder = headerPlaceholder;
      if (headerFormatDisabled) {
        const formatBtn = titleRow ? titleRow.querySelector('button') : undefined;
        if (formatBtn) hide(formatBtn.parentElement);
        hide(children[titleIdx + 2]);
      }
      bindHeaderPrefix(printEl, inputEl);
    }

    if (descriptionDisabled) {
      hideSection(children, descriptionHeading, 2);
    } else if (descriptionHeading) {
      if (descriptionLabel !== undefined) descriptionHeading.textContent = descriptionLabel;
      const descriptionRow = children[children.indexOf(descriptionHeading) + 1];
      const descriptionField = descriptionRow ? descriptionRow.querySelector('textarea, input') : undefined;
      if (descriptionField && descriptionPlaceholder !== undefined) descriptionField.placeholder = descriptionPlaceholder;
    }
    if (sizeDisabled) hideSection(children, sizeHeading, 3);
    if (orientationDisabled) hideSection(children, orientationHeading, 1);
    if (resolutionDisabled) hideSection(children, resolutionHeading, 1);
    if (setScaleDisabled) {
      const scaleIdx = children.indexOf(scaleHeading);
      hideSection(children, scaleHeading, 1);
      const userScaleEl = children[scaleIdx + 2];
      if (userScaleEl && userScaleEl.classList.contains('padding-0')) hide(userScaleEl);
    }

    // Checkbox rows, in render order.
    const toggleRows = children.filter((el) => el.classList.contains('flex') && el.classList.contains('padding-right-small'));
    if (showMarginsDisabled) hide(toggleRows[0]);
    if (showCreatedDisabled) hide(toggleRows[1]);
    if (showScaleDisabled) hide(toggleRows[2]);
    if (showNorthArrowDisabled) hide(toggleRows[3]);
    if (showLegendDisabled) hide(toggleRows[4]);

    if (rotationDisabled) {
      hide(children.find((el) => el.classList.contains('padding-bottom-large')));
    }
  };

  return Origo.ui.Component({
    name: 'siteplanplus',
    onAdd(evt) {
      viewer = evt.target;
      const printControl = viewer.getControlByName('print');
      if (!printControl || typeof printControl.getPrintComponent !== 'function') {
        console.warn('SiteplanPlus: the print control was not found, plugin is inactive.');
        return;
      }
      printComponent = printControl.getPrintComponent();
      if (!printComponent) {
        console.warn('SiteplanPlus: the print component was not created, plugin is inactive.');
        return;
      }
      // Dispatched at the end of PrintComponent.render(), after the settings DOM exists.
      printComponent.on('render', applySettings);
    },
    render() {
      this.dispatch('render');
    }
  });
};

export default SiteplanPlus;
