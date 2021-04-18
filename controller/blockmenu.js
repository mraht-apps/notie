// const Table = require("../model/table.js");
// const Textline = require("../model/textline.js");

function openFirstTime() {
  if (isOpen()) {
    close();
  } else {
    open();
    $(".clickable").eq(0).addClass("active");
  }
}

$(".clickable").on("mouseover", function (event) {
  $(".active").removeClass("active");
  let row = $(event.target);
  if (!$(event.target).is("tr")) {
    row = $(event.target).parents().filter(".clickable").eq(0);
  }
  row.addClass("active");
});

$(".blockMenu").on("mouseout", function (event) {
  $(".active").removeClass("active");
});

$(".clickable").on("click", function (event) {
  addElement();
  close();
});

function addElement(textline) {
  let row = $(".active").eq(0);
  let elementType = row.data("type");

  switch (elementType) {
    case "table":
      let data = {
        caption: "Untitled",
        columns: [
          { name: "Name", type: "text", width: "120px" },
          { name: "Done", type: "checkbox", width: "20px" },
        ],
        rows: [
          {
            Name: "",
            Done: false,
          },
          {
            Name: "",
            Done: false,
          },
          {
            Name: "",
            Done: false,
          },
        ],
      };
      let table = Table.build(null, data);
      $(textline).before(table);
      $(textline).val("");
      break;
    case "textline":
      Textline.build($("#pageContent"), "");
      break;
  }
}

$(document).on("click", function (event) {
  if (
    !isOpen() ||
    $(event.target).parents().filter(".blockMenu").length > 0 ||
    $(event.target).hasClass("blockMenu")
  ) {
    return;
  }
  close();
});

$(document).on("keypress", function(event) {
  switch (event.key) {
    case "Enter":
      addElement();
      break;
  }
});

$(document).on("keyup", function (event) {
  if (!isOpen()) return;

  if ($(".active").length == 0) {
    $(".clickable").eq(0).addClass("active");
  } else {
    let currentActiveRow = $(".active").eq(0);
    let newActiveRow;
    switch (event.key) {
      case "ArrowDown":
        newActiveRow = currentActiveRow.next();
        break;
      case "ArrowUp":
        newActiveRow = currentActiveRow.prev();
        break;
    }

    if (newActiveRow && newActiveRow.hasClass("clickable")) {
      newActiveRow.addClass("active");
      currentActiveRow.removeClass("active");
    }
  }
});

function isOpen() {
  return $(".blockMenu").hasClass("visible");
}

function close() {
  if (!isOpen()) return;
  $(".clickable").removeClass("active");
  $(".blockMenu").removeClass("visible");
  $(".blockMenu").toggle();
}

function open() {
  $(".blockMenu").addClass("visible");
  $(".blockMenu").toggle();
}

module.exports = {
  addElement,
  isOpen,
  openFirstTime,
  close,
};
