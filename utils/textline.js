function init() {
  $(".line").each(function () {
    $(this).on("click", function (event) {
      setContentEditable(event, true);
    });
    $(this).on("focusout", function (event) {
      setContentEditable(event, false);
    });
  });
}

// Make content line editable
function setContentEditable(event, enable) {
  if (enable) {
    event.target.readonly = "false";
    event.target.focus();
  } else if (!event.target.innerText.trim()) {
    event.target.readonly = "true";
  }
}

module.exports = {
  init,
};
