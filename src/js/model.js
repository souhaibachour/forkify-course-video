import { async } from 'regenerator-runtime';
import { API_URL, KEY, RES_PER_PAGE } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  searchResults: {
    /* 
  query is needed for somme analytics
  */
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data; // equivalent let {recipe} = data.data.recipe
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  //// loading data
  try {
    // const data = await getJSON(`${API_URL}/${id}`);
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    // destructing data object and extract recipe property
    /* 
      second data after the dot is a property of object data
      which is the json format of the object responsee
    */
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmarkedRecipe => bookmarkedRecipe.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    console.log(state.recipe);
  } catch (err) {
    // alert(`${err} 💕 💟 ☪ `);
    /* 
    the error will be throwing to catch bloc in control.js to
    be sent to the error handler method (renderError) in recipeView.js heritated from view.js
    */
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    //// loading data
    state.searchResults.query = query;
    console.log(query);
    // const data = await getJSON(`${API_URL}?search=${query}`);
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log('Succes loading recipes');
    // console.log(data);

    state.searchResults.results = data.data.recipes.map(rec => {
      // here we return a new object {}
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.searchResults.page = 1;
    // console.log(state.searchResults.results);
  } catch (err) {
    alert(`${err} 💕 💟 ☪ `);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.searchResults.page) {
  state.searchResults.page = page;
  const start = (page - 1) * state.searchResults.resultsPerPage; // 0
  const end = page * state.searchResults.resultsPerPage; // 9
  // console.log(start, end);
  return state.searchResults.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
  // console.log(state.recipe.servings);
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bokkmark
  state.bookmarks.push(recipe);
  //console.log('souhaib', recipe);

  // Mark recipe as book marked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // store bookmarks in local storage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(
    bookmarkedRecipe => bookmarkedRecipe.id === id
  );
  state.bookmarks.splice(index, 1);

  // Mark the current recipe as NOT bokkmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // store bookmarks in local storage
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        // const ingArr = ingredient[1].replaceAll(' ', '').split(',');
        const ingArr = ingredient[1].split(',').map(elt => elt.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format ! Please use right format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    // console.log(recipe);
    // const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    console.log('Succes creating new recipes');
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};
