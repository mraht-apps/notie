const ElementTypes = {
  table: 1,
  textline: 2,
};

const ColumnTypes = {
  1: "chk",
  2: "txt",
  3: "ref",
};

const PageActions = {
  delete: "deletePage",
};

const TableActions = {
  delete: "deleteTable",
};

module.exports = { ElementTypes, ColumnTypes, PageActions, TableActions };
