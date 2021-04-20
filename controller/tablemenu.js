function isOpen() {
  return $(".tableContextMenu").hasClass("visible");
}

function close() {
  if (!isOpen()) return;
  $(".clickable").removeClass("active");
  $(".tableContextMenu").removeClass("visible");
  $(".tableContextMenu").toggle();
}

function open() {
  $(".tableContextMenu").addClass("visible");
  $(".tableContextMenu").toggle();
}

module.exports = {
  isOpen,
  close,
  open,
};
