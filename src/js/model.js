import { async } from "regenerator-runtime";
import {API_URL, API_KEY, RES_PER_PAGE} from "./config.js"
import {getJSON, sendJSON} from "./helpers.js"
export const state = {
    recipe: {},
    search: {
      query: '',
      results: [],
      resultsPerPage: RES_PER_PAGE,
      page: 1,
    },
    bookmarks: []
}

const createRecipeObject = function(data) {
  const {recipe} = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key})
  }
}
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${API_KEY}`)
    state.recipe = createRecipeObject(data)
    console.log(state.recipe)
    if (state.bookmarks.some(b => b.id === state.recipe.id)) state.recipe.bookmarked = true;
    // state.recipe.bookmarked = true
  } catch(err) {
    console.log(err)
  }
};

export const loadSearch = async function(query) {
  try{
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`)
    state.search.results = data.data.recipes.map(el => {
      return {
        id:el.id,
        title: el.title,
        publisher:el.publisher,
        image: el.image_url, 
        ...(el.key && { key: el.key})
      };
    });
    // lastSearch()
  } catch(err) {
    console.log(err);
  }

}

export const getSearchResultsPage = function(page = state.search.page) {
  const start = (page-1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings; 
  });

  state.recipe.servings = newServings;
}

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}
const lastSearch = function () {
  localStorage.setItem('lastSearch', JSON.stringify(state.search.results))
}

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked =  true;
  persistBookmarks()
}

export const removeBookmark = function (recipe) {
  const index = state.bookmarks.findIndex(el => el.id === recipe.id);
  state.bookmarks.splice(index, 1);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked =  false;
  persistBookmarks()
}

export const uploadRecipe = async function(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      const ingArr = ing[1].split(",")
      if (ingArr.length !== 3) throw new Error('Wrong ingridients format! Please use correct format.')
      const [quantity, unit, description] = ingArr
      return {quantity: quantity ? +quantity : null, unit, description}
    })
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    }
    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe)
    state.recipe = createRecipeObject(data)
    addBookmark(state.recipe);
  } catch (err) {
    throw err
  }

}
const init = function() {
  const storageBookmarks = localStorage.getItem('bookmarks');
  // const storageSearchResults = localStorage.getItem(lastSearch)
  if (storageBookmarks) state.bookmarks = JSON.parse(storageBookmarks);
  // if (storageSearchResults) state.search.results = JSON.parse(storageSearchResults);
}

init()
console.log(state.bookmarks)