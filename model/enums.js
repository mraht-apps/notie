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
    cssId: "columnTypeText",
    img: "../res/img/dark/text.svg",
    descr: "Text",
  },
  CHK: {
    id: 2,
    name: "chk",
    cssId: "columnTypeCheckbox",
    img: "../res/img/dark/checkbox.svg",
    descr: "Checkbox",
  },
  NMB: {
    id: 3,
    name: "nmb",
    cssId: "columnTypeNumber",
    img: "../res/img/dark/rhombus.svg",
    descr: "Number",
  },
  REF: {
    id: 4,
    name: "ref",
    cssId: "columnTypeRelation",
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

module.exports = {
  ElementTypes,
  ParentTypes,
  ColumnTypes,
  PageActions,
  TableActions,
};
