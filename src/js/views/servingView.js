import icons from 'url:../../img/icons.svg';
// import View from './View.js';

class servingView {
    _parentElement = document.querySelector(".recipe");
    recipeIngridients = document.querySelector(".recipe__ingredients");
    _data;

    servingHandler(handler) {
        this._parentElement.addEventListener("click", function(e) {
            const servings = parseInt(document.querySelector(".recipe__info-data--people").innerText)
            const btn = e.target.closest(".btn--tiny")
            if (!btn) return;
            if (btn.classList.contains("btn--decrease-servings")) {
                if (servings == 1) return;
                handler(servings-1)
            } else if (btn.classList.contains("btn--increase-servings")) {
                handler(servings+1)
            }
        })
    }

}

export default new servingView();