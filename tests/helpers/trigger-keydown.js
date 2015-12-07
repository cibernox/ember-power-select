export default function triggerKeydown(domElement, k) {
  var oEvent = document.createEvent("Events");
  oEvent.initEvent('keydown', true, true);
  $.extend(oEvent, {
    view: window,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    keyCode: k,
    charCode: k
  });

  domElement.dispatchEvent(oEvent);
}