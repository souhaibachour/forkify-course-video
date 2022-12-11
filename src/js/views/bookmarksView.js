import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // parcel 2

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it !';
  _message = '';

  addHandlerBookmarksRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    //_data is heritated from View class
    // console.log('souhaib', this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarksView();

/* _generateMarkupPreview(d) {
    const id = window.location.hash.slice(1);
    return `
        <li class="preview">
            <a class="preview__link ${
              d.id === id ? 'preview__link--active' : ''
            }" href="#${d.id}">
                <figure class="preview__fig">
                  <img src="${d.image}" alt="${d.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${d.title}</h4>
                    <p class="preview__publisher">${d.publisher}</p>
                </div>
            </a>
        </li>
        `;
  } */
