const selectTarget = (fromElement, selector) => {
  if (!(fromElement instanceof HTMLElement)) return null;
  return fromElement.querySelector(selector);
};

const resizeData = {
  tracking: false,
  startWidth: null,
  startCursorScreenX: null,
  handleWidth: 10,
  resizeTarget: null,
  parentElement: null,
  maxWidth: null,
};

$(document.body).on("mousedown", ".pagemenu-resize", null, (event) => {
  if (event.button !== 0) return;
  event.preventDefault();
  event.stopPropagation();

  const handleElement = event.currentTarget;
  if (!handleElement.parentElement) {
    console.error(new Error("Parent element not found."));
    return;
  }

  const targetElement = $(".pagemenu");
  resizeData.startWidth = targetElement.outerWidth();
  resizeData.startCursorScreenX = event.screenX;
  resizeData.resizeTarget = targetElement;
  resizeData.parentElement = handleElement.parentElement;
  resizeData.maxWidth =
    $(handleElement.parentElement).innerWidth() - resizeData.handleWidth;
  resizeData.tracking = true;
});

$(window).on("mousemove", function (event) {
  if (resizeData.tracking) {
    const cursorScreenXDelta = event.screenX - resizeData.startCursorScreenX;
    const newWidth = Math.min(
      resizeData.startWidth + cursorScreenXDelta,
      resizeData.maxWidth
    );

    $(resizeData.resizeTarget).outerWidth(newWidth);
  }
});

$(window).on("mouseup", null, null, (event) => {
  if (resizeData.tracking) resizeData.tracking = false;
});
