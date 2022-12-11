import icons from 'url:../../img/icons.svg'; // parcel 2
import { updateServings } from '../model';

export default class View {
  _data;

  renderSpinner() {
    const markup = `
      <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  // this._errorMessage is default value if this function is
  // called without args
  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
            <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /* 
  le parametre data est la valeur retournée par l'une de fonctions
  loadxxxxxx du module model.js non pas data retourné par la méthode fetch 
  */

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data the dat to be rendred to the DOM (e.g. recipe)
   * @param {boolean} [render=true] if false, create a markup instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Souhaib Achour
   * @todo Finish implamentation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    /* 
    convert the markup string into a virtual DOM object living in the memory 
    and then compare it to the current DOM that is actually on the page
    */
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //console.log(curEl, newEl.isEqualNode(curEl));

      // Update changed TEXT
      // here we use optional chaining
      if (
        // first child must be a text node
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('🔥 🔥 🔥 ', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // update changed ATTRIBUTES specially data attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
          // console.log('attribute succesfully changed');
          // console.log('🔥 🔥 🔥 ', attr.name, attr.value);
        });
      }
    });
  }
}
