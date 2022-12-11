import recipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import * as model from './model.js';
// import icons from '../img/icons.svg'; // parcel 1

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

//https://forkify-api.herokuapp.com/api/v2

/////////////////////////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlBookmarks = function () {
  // console.log('💟 💟 💟', model.state.bookmarks.length);
  bookmarksView.render(model.state.bookmarks);
};

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 0) render loading spinner
    recipeView.renderSpinner();

    // 1) loading recipe
    /* 
    here we consume the promise without returning any result
    meaning we don't store the result in a variable because 
    all we want is to manipulate the state
    */
    await model.loadRecipe(id);
    //const { recipe } = model.state;

    // 2) rendering data
    recipeView.render(model.state.recipe);

    // 3) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 4) Update bookmark view to mark selected bookmarked recipe in the list
    bookmarksView.update(model.state.bookmarks);

    // test servings update
    //controlServings();
  } catch (err) {
    // alert(err);
    // sending error message to renderError Method in RecipeView
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //console.log(resultsView);

    // 1) get search query
    const query = SearchView.getQuery();

    // 2) load results
    await model.loadSearchResults(query);

    // 3) render results
    // console.log(model.state.searchResults.results);
    //resultsView.render(model.state.searchResults.results);

    // 3.1) render results per page (pagination)
    resultsView.render(model.getSearchResultsPage());
    // console.log(model.getSearchResultsPage(1));

    // 4) render initial pagination button(s)
    paginationView.render(model.state.searchResults);
  } catch (err) {
    // console.error(err);
    // throwing the error to resultViews.js (because printing errors is the view job)
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  console.log(goToPage);
  // 1) render NEW results per page (pagination)
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) render NEW pagination button(s)
  paginationView.render(model.state.searchResults);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add or remove a bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //console.log(model.state.recipe);

  // 2) update recipe View
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render the spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render new created Recipe
    recipeView.render(model.state.recipe);

    // render succes message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🔥 🚒  🔥 ', err);
    addRecipeView.renderError(err.message);
  }
};

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
const init = function () {
  bookmarksView.addHandlerBookmarksRender(controlBookmarks);
  recipeView.addHandler(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome Souhaib');
};

init();
