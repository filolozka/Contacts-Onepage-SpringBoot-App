document.addEventListener("DOMContentLoaded", function main() {
    const formDom = document.querySelector("#contact-form");
    const contactTemplateDom = document.querySelector("#contact-template");
    const contactWrapperDom = document.querySelector("#contact-wrapper");

    const contactClient = new ContactClient();
    const contactRenderer = new HtmlRenderer(contactTemplateDom, contactWrapperDom);

    const formController = new FormController(contactClient, contactRenderer);

    formDom.addEventListener("click", formController);
    contactWrapperDom.addEventListener("click", contactController);
});

const REAL_CONTACT_CLASS = "real-contact";

class ContactController {
    constructor(htmlRenderer, contactClient) {
        this.htmlRenderer = htmlRenderer;
        this.contactClient = contactClient;
    }

    handleEvent(event) {
        const action = event.target.dataset.action
        if (action !== undefined)
            this[action](event);
    }

    toggleDetails(event) {
        this.htmlRenderer.toggleContactDetails(event);
    }

    remove(event) {
        //TODO complete. Take the contact id from the event.target (see 'toEditForm' from html renderer to get contactDom -> contact)
        // then rerender all persons
    }

    edit(event) {
        this.htmlRenderer.toEditForm(event);
    }
}

class FormController {

    constructor(contactClient, contactRenderer) {
        this.contactClient = contactClient;
        this.contactRenderer = contactRenderer;
        this._init();
    }

    async _init() {
        const response = await this.contactClient.getAll();
        if (response.ok) {
            const contacts = await response.json();
            this.contactRenderer.renderContacts(contacts);
        }
    }

    handleEvent(event) {
        const action = event.target.dataset.action;
        if (action !== undefined)
            this[action](event);
    }

    async add(event) {
        const formDom = event.currentTarget;
        const contact = {
            name: formDom.elements.name.value,
            lastName: formDom.elements.lastname.value,
            age: formDom.elements.age.value,
        };
        const response = await this.contactClient.add(contact);

        if (response.ok) {
            this._init();
            this.contactRenderer.clearForm();
        }
       // document.forms[0].reset();
    }


    edit(event) {
        //TODO see method add
    }

    cancel(event) {
        this.contactRenderer.toAddForm();
    }
}

class HtmlRenderer {
    constructor(contactTemplateDom, contactWrapperDom, formDom) {
        this.contactTemplateDom = contactTemplateDom;
        this.contactWrapperDom = contactWrapperDom;
        this.formDom = formDom;

        this.addButtonDom = formDom.querySelector("#add-button");
        this.editButtonDom = formDom.querySelector("#edit-button");
        this.cancelButtonDom = formDom.querySelector("#cancel-button");
    }

    renderContacts(contacts) {
        this.removeAll();
        for (let contact of contacts) {
            let contactDom = this.renderContact(contact);
            this.contactWrapperDom.append(contactDom);
        }
    }

    removeAll() {
        let contactsDom = this.contactWrapperDom.querySelectorAll(`.${REAL_CONTACT_CLASS}`);
        for (let contactDom of contactsDom) {
            contactDom.remove();
        }
    }

    renderContact(contact) {
        const res = this.contactTemplateDom.cloneNode(true);
        res.contact = contact;
        res.classList.remove("hide");
        res.classList.add(REAL_CONTACT_CLASS);
        const contactDetailsLink = res.querySelector(".contact-details-link");
        contactDetailsLink.innerHTML = `${contact.name} ${contact.lastName}`;

        res.querySelector(".name-value").innerHTML = contact.name;
        res.querySelector(".second-name-value").innerHTML = contact.lastName;
        res.querySelector(".age-value").innerHTML = contact.age;

        return res;
    }

    clearForm() {
        this.formDom.elements.name.value = null;
        this.formDom.elements.lastName.value = null;
        this.formDom.elements.age.value = null;
    }

    toggleContactDetails(event) {
        const contactDetailsDom = event.target.closest(".real-contact").querySelector(".contact-details");
        contactDetailsDom.classList.toggle("hide");
    }

    toEditForm(event) {
        const contactDom = event.target.closest(".real-contact");
        const contact = contactDom.contact;

        this.formDom.elements.name.value = contact.name;
        this.formDom.elements.lastName.value = contact.lastName;
        this.formDom.elements.age.value = contact.age;
        this.formDom.elements.id.value = contact.id;

        this.addButtonDom.classList.add("hide");
        this.editButtonDom.classList.remove("hide");
        this.cancelButtonDom.classList.remove("hide");
    }

    toAddForm() {
        this.clearForm()

        this.editButtonDom.classList.add("hide");
        this.cancelButtonDom.classList.add("hide");
        this.addButtonDom.classList.remove("hide");
    }
}

class ContactClient {
    static CONTACTS_PATH = "/api/contacts";

    add(contact) {
        return fetch(ContactClient.CONTACTS_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });
    }

    getAll() {
        return fetch(ContactClient.CONTACTS_PATH, {
            method: 'GET',
        });
    }
}
