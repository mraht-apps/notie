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

module.exports = {
  ElementTypes,
  ParentTypes,
  ColumnTypes,
  PageActions,
  TableActions,
};
