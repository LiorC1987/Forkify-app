import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';
import * as model from "./model.js"
import recipeView from "./views/recipeView.js"
import resultsView from "./views/resultsView.js"
import searchView from "./views/searchView.js"
import bookmarkView from "./views/bookmarkView.js"
import addRecipeView from "./views/addRecipeView.js"
import { RES_PER_PAGE } from "./config.js"
import { async } from 'regenerator-runtime';
import paginationView from './views/paginationView.js';
import servingView from './views/servingView.js';
import { addBookmark } from './model.js';
const { request } = require("https");

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};


async function showRecipe(){
  try {
    const id = window.location.hash.slice(1);
    if (!id) return
    recipeView.renderSpinner()
    resultsView.update(model.getSearchResultsPage(model.state.search.page))
    
  // 1) loading recipe
    await model.loadRecipe(id);
  // 2) Rendering recipe
    recipeView.render(model.state.recipe)
    bookmarkView.render(model.state.bookmarks)
  } catch (err) {
    console.log(err)
  }

  }
const controlSearchResults = async function() {
  try {
    // 1. Get search query
    const query = searchView.getQuery()
    model.state.search.page = 1;
    const page = 1;
    if (!query) return;
    // 2. Load search results
    await model.loadSearch(query)
    // 3. Render results
    resultsView.render(model.getSearchResultsPage(page))

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search)

  } catch (err) {
    console.log(err)
  }
}

function controlPage(direction) {
  model.state.search.page += direction
  const page = model.state.search.page
  resultsView.render(model.getSearchResultsPage(page))
  paginationView.render(model.state.search)
}

function controlServing(newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  !model.state.recipe.bookmarked 
  ? model.addBookmark(model.state.recipe) 
  : model.removeBookmark(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks)
}

function controlBookmarks() {
  bookmarkView.render(model.state.bookmarks)
}

async function controlAddRecipe(newRecipe) {
  try {
    // addRecipeView.renderSpinner()
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    bookmarkView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
    addRecipeView.renderMessage();
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC*1000);
  } catch(err) {
    console.error("BOOM", err)
    addRecipeView.renderError(err.message)
  }

}
const init = function() {
  recipeView.addHandlerRender(showRecipe)
  searchView.searchHandler(controlSearchResults)
  paginationView.paginationHandler(controlPage)
  servingView.servingHandler(controlServing)
  recipeView.addBookmarkHandler(controlAddBookmark)
  bookmarkView.bookmarkHandler(controlBookmarks)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()


