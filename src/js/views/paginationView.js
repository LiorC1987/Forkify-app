import View from './View.js';
import icons from 'url:../../img/icons.svg';

class paginationView extends View{
    _parentElement = document.querySelector(".pagination");

    _generateMarkup() {
        const {results, page, resultsPerPage} = this._data;
        const resultsNum = results.length
        if (resultsNum <= resultsPerPage) {
            return this.insertMarkup("hidden","hidden", 1, 3)
        } else if (page === 1) {
            return this.insertMarkup("hidden","", 1, 2)
        } else if (resultsNum < page*10) {
            return this.insertMarkup("","hidden", page-1, page+1)
        } else {
            return this.insertMarkup("","", page-1, page+1)
        }
    }
    insertMarkup(leftHidden, rightHidden, leftPage, rightPage) {
        return `
        <div class="pagination">
        <button class="btn--inline pagination__btn--prev ${leftHidden}">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${leftPage}</span>
        </button>
        <button class="btn--inline pagination__btn--next ${rightHidden}">
          <span>Page ${rightPage}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      </div>
        `
    }
    paginationHandler(handler) {
        this._parentElement.addEventListener("click", function(e) {
            const btn = e.target.closest(".btn--inline")
            console.log(btn)
            if (!btn) return;
            if (btn.classList.contains("pagination__btn--prev")) {
                handler(-1)
            } else if (btn.classList.contains("pagination__btn--next")) {
                handler(1)
            }
        })
    };

}
export default new paginationView();