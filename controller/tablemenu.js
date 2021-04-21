function isOpen() {
  return $(".tableMenu").hasClass("visible");
}

function close() {
  if (!isOpen()) return;
  $(".clickable").removeClass("active");
  $(".tableMenu").removeClass("visible");
  $(".tableMenu").toggle();
}

function open() {
  $(".tableMenu").addClass("visible");
  $(".tableMenu").toggle();
}

module.exports = {
  isOpen,
  close,
  open,
};
