function init() {
  var tables = $(".contentTable");
  for (var i = 0; i < tables.length; i++) {
    buildResizableGrid(tables[i]);
  }

  let rows = $("tr");
  for (var i = 0; i < rows.length; i++) {
    $(rows[i]).on("contextmenu", function (event) {
      let parents = $(event.target).parents();
      parents.each(function () {
        if ($(this).is("tr")) {
          setActiveRow($(this));
        }
      });
    });
  }
}

function setActiveRow(activeRow) {
  console.log(activeRow);
  $("tr").each(function () {
    if (this.is(activeRow)) {
      $(this).attr("id", "activeRow");
    } else {
      $(this).attr("id", "");
    }
  });
}

// TODO Build grid based on saved user data
function buildResizableGrid(table) {
  var row = $(table).find("tr").eq(0);
  var cols = row ? row.children() : undefined;
  if (!cols) return;

  var rowHeight = row.outerHeight();

  for (var i = 0; i < cols.length - 1; i++) {
    var div = createDiv(rowHeight);
    cols[i].appendChild(div);
    cols[i].style.position = "relative";
    cols[i].style.width = "100px";
    setListeners(div);
  }
}

function createDiv(height) {
  var div = document.createElement("div");
  div.style.height = height + "px";
  div.className = "columnResizeSeparator";
  return div;
}

function setListeners(div) {
  var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

  $(div).on("mousedown", function (e) {
    curCol = e.target.parentElement;
    nxtCol = curCol.nextElementSibling;
    pageX = e.pageX;

    var padding = paddingDiff(curCol);
    curColWidth = curCol.offsetWidth - padding;
  });

  $(div).on("mouseover", function (e) {
    e.target.style.backgroundColor = "rgba(46, 170, 220, 1)";
  });

  $(div).on("mouseout", function (e) {
    e.target.style.backgroundColor = "";
  });

  $(div).on("dblclick", function (e) {
    let column = $(e.target).parent();
    let text = column.text().trim();

    var tempDiv = document.createElement("div");
    document.body.appendChild(tempDiv);
    tempDiv.style.fontSize = "" + 16 + "px";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = -1000;
    tempDiv.style.top = -1000;
    tempDiv.textContent = text;

    var width = tempDiv.clientWidth;
    document.body.removeChild(tempDiv);
    tempDiv = null;

    if (width === 0) {
      width = 20;
    }
    column.width(width);
  });

  $(document).on("mousemove", function (e) {
    if (curCol) {
      var diffX = e.pageX - pageX;
      let oldWidthStr = curCol.style.width;
      let sliceIndex = oldWidthStr.indexOf("px");
      let oldWidth = parseInt(parseInt(oldWidthStr.slice(0, sliceIndex)) + 1);

      let newWidth = curColWidth + diffX;
      if (newWidth >= 19 && oldWidth !== newWidth) {
        curCol.style.width = newWidth + "px";
      }
    }
  });

  $(document).on("mouseup", function (e) {
    console.log("up");
    curCol = undefined;
    nxtCol = undefined;
    pageX = undefined;
    nxtColWidth = undefined;
    curColWidth = undefined;
  });
}

function paddingDiff(col) {
  if (getStyleVal(col, "box-sizing") == "border-box") {
    return 0;
  }

  var padLeft = getStyleVal(col, "padding-left");
  var padRight = getStyleVal(col, "padding-right");
  return parseInt(padLeft) + parseInt(padRight);
}

function getStyleVal(elm, css) {
  return window.getComputedStyle(elm, null).getPropertyValue(css);
}

module.exports = {
  init,
};
