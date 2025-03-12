import PhoneInput from "./phoneinput.js";

const linkPrefix = "/contact-form";

// Creates MyElements extending HTML Element
class ContactForm extends HTMLElement {
  // Fires when an instance of the element is created or updated
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "closed" });
  }

  // Fires when an instance was inserted into the document
  connectedCallback() {
    this.shadow.innerHTML = /*html*/`
      <p class="result">Merci ! Le formulaire a bien été envoyé.</p>
      <form method="post" action="/contact-form">
        <input required type="text" name="name" placeholder="Nom complet">
        <phone-input></phone-input>
        <input required type="email" name="email" placeholder="Email">
        <textarea required name="message" placeholder="Tapez votre message ici" cols="30" rows="8"></textarea>
        <button class="submit ready">
          <img class="submit-img" src="${linkPrefix}/checkmark.svg" alt="">
          <span class="submit-text">
            Prendre rendez-vous
          </span>
          <div class="loader invisible"></div>
        </button>
      </form>
      <style>
      @import "/contact-form/contact-form.css";
      </style>
    `;

    /**
     * @type {HTMLFormElement|null}
     */
    const formDom = this.shadow.querySelector("form");
    if (!formDom) return;

    /**
     * @type {HTMLImageElement|null}
     */
    const checkMarkDom = this.shadow.querySelector(".submit-img");
    if (!checkMarkDom) return;

    /**
     * @type {HTMLSpanElement|null}
     */
    const submitTextDom = this.shadow.querySelector(".submit-text");
    if (!submitTextDom) return;

    /**
     * @type {HTMLButtonElement|null}
     */
    const submitButtonDom = this.shadow.querySelector(".submit");
    if (!submitButtonDom) return;

    /**
     * @type {HTMLSpanElement|null}
     */
    const loaderDom = this.shadow.querySelector(".loader");
    if (!loaderDom) return;

    /**
     * @type {HTMLDivElement|null}
     */
    const resultDom = this.shadow.querySelector(".result");
    if (!resultDom) return;
    const originalResultText = resultDom.textContent;

    formDom.onsubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData(formDom);

      let data = {};
      for (const pair of formData) {
        data[pair[0]] = pair[1];
      }

      checkMarkDom.classList.toggle("invisible");
      submitTextDom.classList.toggle("invisible");
      loaderDom.classList.toggle("invisible");
      submitButtonDom.classList.toggle("ready");

      let response = { status: 0 };
      try {
        response = await fetch(`/contact-form/post.php`, {
          method: "POST",
          body: JSON.stringify(data),
        });
      } catch (error) {
        resultDom.textContent =
          "Il y a une erreur avec le formulaire, réessayez plus tard.";
        resultDom.classList.add("error");
      } finally {
        if (response.status !== 200) {
          resultDom.textContent =
            "Il y a une erreur avec le formulaire, réessayez plus tard.";
          resultDom.classList.add("error");
        } else {
          // formDom.reset();
        }

        setTimeout(() => {
          checkMarkDom.classList.toggle("invisible");
          submitTextDom.classList.toggle("invisible");
          loaderDom.classList.toggle("invisible");
          submitButtonDom.classList.toggle("ready");

          resultDom.classList.toggle("show");
        }, 500);

        setTimeout(() => {
          resultDom.textContent = originalResultText;
          resultDom.classList.toggle("show");
          resultDom.classList.remove("error");
        }, 10500);
      }
    };
  }

  // Fires when an instance was removed from the document
  disconnectedCallback() {}

  // Fires when an attribute was added, removed, or updated
  attributeChangedCallback(attrName, oldVal, newVal) {}

  // Fires when an element is moved to a new document
  adoptedCallback() {}
}

// Registers custom element
window.customElements.define("contact-form", ContactForm);
