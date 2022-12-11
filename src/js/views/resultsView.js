import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // parcel 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipies found for your query, try another one !';
  _message = '';

  _generateMarkup() {
    //_data is heritated from View class
    return this._data.map(result => previewView.render(result, false)).join();
  }
}
export default new ResultsView();
