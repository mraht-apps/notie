class Blockelement {
  constructor(id, type) {
    this.container = document.createElement("div");
    this.container.className = `pageElement ${type}`;
    if (!id || id.length == 0) {
      this.container.dataset.uuid = Crypto.generateUUID(6);
    } else {
      this.container.dataset.uuid = id;
    }
  }
}

module.exports = Blockelement;
