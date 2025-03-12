import countries from "./countries.js";



// Creates MyElements extending HTML Element

export default class PhoneInput extends HTMLElement {

  // Fires when an instance of the element is created or updated

  constructor() {

    super();

  }



  // Fires when an instance was inserted into the document

  connectedCallback() {

    const defaultCountry = countries.find((country) => country.code === "FR");



    this.innerHTML = /*html*/ `

        <div class="inputs">

          <button type="button" class="country">

            <span class="flag">${defaultCountry?.flag}</span>

            <span class="arrow closed"></span>

          </button>

          <span class="phone">

            <input readonly name="dial-code" class="dial-code" value="${

              defaultCountry?.dial_code

            }"/>

            <input class="tel-input" type="tel" name="phone">

          </span>

        </div>

        <div class="select hidden">

          <div class="searchbar">

            <span class="searchlogo">🔎</span>

            <input class="searchinput" type="search" placeholder="Recherche">

          </div>

          <div class="countrylist">

            ${countries

              .map((_, index) => this.countryListElement(index))

              .join("")}

          </div>

        </div>

      <style>

      </style>

    `;



    /**

     * @type {HTMLDivElement|null}

     */

    const selectDom = this.querySelector(".select");

    if (!selectDom) return;



    /**

     * @type {HTMLInputElement|null}

     */

    const searchBarDom = this.querySelector(".searchinput");

    if (!searchBarDom) return;



    /**

     * @type {HTMLInputElement|null}

     */

    const telInputDom = this.querySelector(".tel-input");

    if (!telInputDom) return;



    /**

     * @type {HTMLLIElement|null}

     */

    const countryListDom = this.querySelector(".countrylist");

    if (!countryListDom) return;



    /**

     * @type {HTMLInputElement|null}

     */

    const phoneInputDom = this.querySelector(".tel-input");

    if (!phoneInputDom) return;



    /**

     * @type {HTMLInputElement|null}

     */

    const dialCodeDom = this.querySelector(".dial-code");

    if (!dialCodeDom) return;



    /**

     * @type {HTMLButtonElement|null}

     */

    const flagButtonDom = this.querySelector(".country");

    if (!flagButtonDom) return;



    /**

     * @type {HTMLSpanElement|null}

     */

    const flagDom = this.querySelector(".flag");

    if (!flagDom) return;



    /**

     * @type {HTMLSpanElement|null}

     */

    const arrowDom = this.querySelector(".arrow");

    if (!arrowDom) return;



    // search countries in the list

    searchBarDom.oninput = (event) => {

      const search = searchBarDom?.value;

      const filteredCountries = countries.filter((country) =>

        (country.name + country.dial_code)

          .toLowerCase()

          .includes(search.toLocaleLowerCase())

      );

      countryListDom.innerHTML = filteredCountries

        .map((country) => this.countryListElement(country.id))

        .join("");

    };



    // select country from the list

    countryListDom.onclick = (event) => {

      const child = event.target;

      if (!(child instanceof HTMLLIElement)) return;



      const index = parseInt(child.getAttribute("index") || "-1");

      if (index === -1) return;



      dialCodeDom.value = countries[index].dial_code;

      flagDom.textContent = countries[index].flag;



      selectDom.classList.toggle("hidden");

      arrowDom.classList.toggle("closed");

    };



    // hide and show select

    flagButtonDom.onclick = (event) => {

      selectDom.classList.toggle("hidden");

      arrowDom.classList.toggle("closed");



      if (!selectDom.classList.contains("hidden")) {

        searchBarDom.focus();

      }

    };

  }



  /**

   * @param {number} index

   * @returns {string}

   */

  countryListElement(index) {

    const country = countries[index];

    return /*html*/ `

      <li index=${index}>${country.flag}  ${country.name}  ${country.dial_code}</li>

    `;

  }



  // Fires when an instance was removed from the document

  disconnectedCallback() {}



  // Fires when an attribute was added, removed, or updated

  attributeChangedCallback(attrName, oldVal, newVal) {}



  // Fires when an element is moved to a new document

  adoptedCallback() {}

}



// Registers custom element

window.customElements.define("phone-input", PhoneInput);

