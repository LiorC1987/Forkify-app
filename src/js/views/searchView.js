class searchView {
  _parentEl = document.querySelector(".search");

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this.clearInput();
    return query;
  }

  clearInput() {
    this._parentEl.querySelector('.search__field').value = "";
  }
  searchHandler(handler) {
    this._parentEl.addEventListener("submit", function(e) {
      e.preventDefault()
      handler()
    })
  }s
}

export default new searchView();