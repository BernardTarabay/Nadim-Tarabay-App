export class ScoreDocument {
  constructor({ pages, locked, pageCount }) {
    this.pages = pages;
    this.locked = locked;
    this.pageCount = pageCount;
  }

  static async open(source) {
    return new ScoreDocument(source);
  }

  isLocked(index) {
    return index >= this.pages.length;
  }

  async getPage(index) {
    return this.isLocked(index) ? this.locked : this.pages[index];
  }

  dispose() {}
}
