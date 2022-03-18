import icons from 'url:../../img/icons.svg';
import View from './View.js';

class resultsView extends View {
    _parentElement = document.querySelector(".results");
    _data;
    _errorMessage = 'No recipes found for your query. Please try again';
    _message = ``;
    _generateMarkup() {
      const id = window.location.hash.slice(1);
        return this._data.map(recipe => `
        <li class="preview">
        <a class="preview__link ${recipe.id == id ? "preview__link--active" : ""}" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src="${recipe.image}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${recipe.title.length > 25 ? recipe.title.slice(0,25)+ '...' : recipe.title }</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
            </div>
            <div class="preview__user-generated ${recipe.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          </div>
        </a>
      </li>
        `).join("")
          }
};
export default new resultsView();