class Blockmenu {
  static init() {
    Blockmenu.registerEvents();
  }

  static registerEvents() {
    $(".blockMenu").on("mouseout", function (event) {
      Eventhandler.onMouseout(event);
    });

    $(".clickable").on("click", function (event) {
      Eventhandler.onClickMenuItem(event);
    });

    $(".clickable").on("mouseover", function (event) {
      Eventhandler.onMouseoverMenuItem(event);
    });
  }

  static openFirstTime(x, y) {
    if (Blockmenu.isOpen()) {
      Blockmenu.closeAll();
    } else {
      $(".blockMenu").css({ top: y - 100 + "px", left: x + 10 + "px" });
      Blockmenu.open();
      $(".clickable").eq(0).addClass("active");
    }
  }

  static addElement() {
    let row = $(".active").eq(0);
    let elementType = row.data("type");

    switch (elementType) {
      case "table":
        let data = {
          caption: "",
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
        Textline.appendBefore(table);
        break;
      case "textline":
        Textline.build($("#content"), "");
        break;
    }
  }

  static isOpen() {
    return $(".blockMenu").hasClass("visible");
  }

  static closeAll() {
    $(".clickable").removeClass("active");
    $(".blockMenu").removeClass("visible");
    $(".blockMenu").toggle(false);
  }

  static open() {
    Blockmenu.closeAll();
    $(".blockMenu").addClass("visible");
    $(".blockMenu").toggle(true);
  }
}

class Eventhandler {
  static onClickMenuItem(event) {
    Blockmenu.addElement();
    Blockmenu.closeAll();
  }

  static onMouseout(event) {
    $(".active").removeClass("active");
  }

  static onMouseoverMenuItem(event) {
    $(".active").removeClass("active");
    let row = $(event.target);
    if (!$(event.target).is("tr")) {
      row = $(event.target).parents().filter(".clickable").eq(0);
    }
    row.addClass("active");
  }
}

module.exports = Blockmenu;
