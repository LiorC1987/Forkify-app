import View from './View.js';
import icons from 'url:../../img/icons.svg';
import {Fraction} from 'fractional';
class BookmarkView extends View {
    _parentElement = document.querySelector(".bookmarks__list");
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it!'
    _message = '';


    bookmarkHandler(handler) {
      window.addEventListener("load", handler);
    }
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
            </div>
          </a>
        </li>
          `).join("")
            }
    
}

export default new BookmarkView();