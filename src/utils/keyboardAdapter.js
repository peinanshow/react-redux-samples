/**
 * Defines a designer flash<->script focus bridge.
 */
export default class KeyboardAdapter {
  constructor(designerId, adapterId) {
    this.designerId = designerId;
    this.adapterId = adapterId;
    this.initialize();
  }

  /**
   * Initializes a new instance of Designer with the specified flash designer and focus element.
   */
  initialize() {
    const designer = document.getElementById(this.designerId);
    const adapter = document.getElementById(this.adapterId);
    const isIE = navigator.appVersion.indexOf('MSIE') !== -1;
    const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;
    const isWinNt52 = navigator.userAgent.indexOf('Windows NT 5.2');

    if (designer === null) throw new Error('"designer" is null.');
    if (adapter === null) throw new Error('"adapter" is null.');

    // Adapter events.
    adapter.onfocus = () =>
      designer.onAdapterFocusIn === 'function'
        ? designer.onAdapterFocusIn()
        : null;

    adapter.onblur = () =>
      designer.onAdapterFocusOut === 'function'
        ? designer.onAdapterFocusOut()
        : null;

    if (isIE) {
      adapter.onactivate = () =>
        designer.onAdapterActivate === 'function'
          ? designer.onAdapterActivate()
          : null;

      adapter.ondeactivate = () =>
        designer.onAdapterDeactivate === 'function'
          ? designer.onAdapterDeactivate()
          : null;
    } else {
      document.onkeydown = (event) => {
        // arrow keys (left, up, right, down)
        switch (event.which) {
          case 37:
          case 38:
          case 39:
          case 40:
            return false;
          default:
            return true;
        }
      };
    }

    adapter.onkeydown = isIE
      ? () => designer.onKeyDown(window.event.keyCode, window.event.ctrlKey, window.event.altKey, window.event.shiftKey)
      : (event) => designer.onKeyDown(event.which, event.ctrlKey, event.altKey, event.shiftKey);

    adapter.onkeyup = isIE
      ? () => designer.onKeyUp(window.event.keyCode, window.event.ctrlKey, window.event.altKey, window.event.shiftKey)
      : (event) => designer.onKeyUp(event.which, event.ctrlKey, event.altKey, event.shiftKey);

    this.focusDesigner = () => designer.focus(); // Forces designer element to acquire focus.
    this.unfocusDesigner = () => designer.blur(); // Forces designer element to lose focus.
    this.focusAdapter = () => adapter.focus(); // Forces adapter element to acquire focus.

    adapter.focus();

    return { noasync: isFirefox && isWinNt52 };
  }
}
