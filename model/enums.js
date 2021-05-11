const ElementTypes = {
  NONE: { id: 0, name: "none" },
  TABLE: { id: 1, name: "table", label: "Table", descr: "Create a table in this page.", img: "../res/img/table.png" },
  TEXTLINE: {
    id: 2,
    name: "textline",
    label: "Textline",
    descr: "Just start writing with plain text.",
    img: "../res/img/text.png",
  },
};

const ParentTypes = {
  0: "none",
  1: "page",
  2: "table",
};

const ColumnTypes = {
  ADD: {
    id: "add",
  },
  TXT: {
    id: 1,
    name: "txt",
    img: "../res/img/dark/text.svg",
    descr: "Text",
  },
  CHK: {
    id: 2,
    name: "chk",
    img: "../res/img/dark/checkbox.svg",
    descr: "Checkbox",
  },
  NUM: {
    id: 3,
    name: "num",
    img: "../res/img/dark/rhombus.svg",
    descr: "Number",
  },
  REL: {
    id: 4,
    name: "rel",
    img: "../res/img/dark/relation.svg",
    descr: "Relation",
  },
};

const PageActions = {
  delete: "deletePage",
};

const TableActions = {
  delete: "deleteTable",
};

const FocusActions = {
  NONE: 0,
  ALL: 1,
  START: 2,
  END: 3,
};

module.exports = {
  ElementTypes,
  ParentTypes,
  ColumnTypes,
  PageActions,
  TableActions,
  FocusActions,
};
