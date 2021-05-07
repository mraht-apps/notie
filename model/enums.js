const ElementTypes = {
  table: 1,
  textline: 2,
};

const ParentTypes = {
  none: 0,
  page: 1,
  table: 2,
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
  // NUM: {
  //   id: 3,
  //   name: "num",
  //   img: "../res/img/dark/rhombus.svg",
  //   descr: "Number",
  // },
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
