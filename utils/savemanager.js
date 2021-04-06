function save() {
  let pagename = savePageName();
  let lineContent = saveTextBlocks();
  let tablesContent = saveTables();

  let page = {
    pageName: pagename,
    lineContent: lineContent,
    tables: tablesContent,
  };

  return JSON.stringify(page);
}

function savePageName() {
  return $("#page-title").text();
}

function saveTextBlocks() {
  let lineContent = [];
  const elements = $(".line");
  Array.prototype.forEach.call(elements, function (element) {
    lineContent.push(element.innerText);
  });
}

function saveTables() {
  let tablesContent = [];
  const tables = $(".contentTable");
  Array.prototype.forEach.call(tables, function (table) {
    let columnsContent = [];

    var row = table.getElementsByTagName("tr")[0];
    var cols = row ? row.children : undefined;
    if (cols) {
      for (var i = 0; i < cols.length - 1; i++) {
        let columnContent = {
          name: cols[i].innerText,
          width: cols[i].style.width,
        };
        columnsContent.push(columnContent);
      }
    }

    let tableContent = {
      caption: $(table.caption).children().text(),
      columns: columnsContent,
    };
    tablesContent.push(tableContent);
  });

  return tablesContent;
}

module.exports = {
  save,
};
