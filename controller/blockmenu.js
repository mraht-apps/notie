class Blockmenu {
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

  static openFirstTime() {
    if (Blockmenu.isOpen()) {
      Blockmenu.close();
    } else {
      Blockmenu.open();
      $(".clickable").eq(0).addClass("active");
    }
  }

  static addElement(textline) {
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
        let table = TableJS.Table.build(null, data);
        $(textline).before(table);
        $(textline).val("");
        break;
      case "textline":
        Textline.build($("#pageContent"), "");
        break;
    }
  }

  static isOpen() {
    return $(".blockMenu").hasClass("visible");
  }

  static close() {
    if (!Blockmenu.isOpen()) return;
    $(".clickable").removeClass("active");
    $(".blockMenu").removeClass("visible");
    $(".blockMenu").toggle();
  }

  static open() {
    $(".blockMenu").addClass("visible");
    $(".blockMenu").toggle();
  }
}

class Eventhandler {
  static onClickMenuItem(event) {
    Blockmenu.addElement();
    Blockmenu.close();
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

module.exports = { Blockmenu, Eventhandler }
