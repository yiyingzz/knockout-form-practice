// a Class for user object with user info (pre-ES6?)
// we would need to pass in a LOT of info though!!!
function User(name, gender, dob, address, contactInfo, login) {
  const self = this;
  self.name = name;
  self.gender = gender;
  self.dob = dob;
  self.address = address;
  self.contactInfo = contactInfo;
  self.login = login;
}

// rewriting in ES6 classes

// viewmodel - so this is the page essentially
// so inputs should be bound here??
function SignUpViewModel() {
  // uneditable data (b/c this is so long, might make sense to have them in separate file that you could import??)
  this.genderOptions = ["Female", "Male", "X"];
  this.dobYearOptions = [
    1980,
    1981,
    1982,
    1983,
    1984,
    1985,
    1986,
    1987,
    1988,
    1990,
    1991,
    1992,
    1993,
    1994,
    1995
  ];
  this.dobMonthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  this.dobDayOptions = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31
  ];
  this.countryOptions = ["Canada", "USA", "China", "France"];
  this.provStateOptions = ko.observableArray([]);
  this.provStateData = {
    canada: ["Alberta", "Ontario", "Prince Edward Island", "Quebec"],
    usa: ["New York", "Florida", "California", "Minnesota", "Maryland"]
  };
  this.isCanadaOrUS = ko.observable(true);
  this.phoneTypeOptions = ["Home", "Business", "Mobile"];
  this.preferredLangOptions = ["English", "French"];

  // input values (user info)
  // login
  this.email = ko.observable("");
  this.password1 = ko.observable("");
  this.password2 = ko.observable("");

  // name
  this.firstName = ko.observable("");
  this.middleName = ko.observable("");
  this.lastName = ko.observable("");

  // gender & dob
  this.gender = ko.observable("");
  this.dobYear = ko.observable("");
  this.dobMonth = ko.observable("");
  this.dobDay = ko.observable("");

  // address
  this.streetAddress1 = ko.observable("");
  this.streetAddress2 = ko.observable("");
  this.country = ko.observable("");
  this.provState = ko.observable("");
  this.townCity = ko.observable("");
  this.postalZipCode = ko.observable("");

  // contact
  this.phoneType = ko.observable("");
  this.phoneNumber = ko.observable("");
  this.preferredLang = ko.observable("");
  this.firstName = ko.observable("");

  // editable data (user list)
  this.users = ko.observableArray([]);

  this.errors = {
    // what if I just make 1 property for each, use truthy/falsy to show error message, the value of the property will be the error message itself
    hasErrors: ko.observable(false),
    email: ko.observable(),
    password1: ko.observable(),
    password2: ko.observable(),
    firstName: ko.observable(),
    lastName: ko.observable(),
    gender: ko.observable(),
    dobYear: ko.observable(),
    dobMonth: ko.observable(),
    dobDay: ko.observable(),
    dob: ko.observable(),
    streetAddress1: ko.observable(),
    country: ko.observable(),
    provState: ko.observable(),
    townCity: ko.observable(),
    postalZipCode: ko.observable(),
    phoneType: ko.observable(),
    phoneNumber: ko.observable(),
    preferredLang: ko.observable()
  };

  // operations (methods)

  this.showErrorMessage = function(id, message = "This field is required.") {
    this.errors[id](message);
  };

  this.submitForm = e => {
    // check for blank inputs
    this.checkInputs(e);
  };

  // This just checks for blank inputs, then calls the more specific error checking functions
  this.checkInputs = form => {
    // loop through list to grab all input & select nodes
    let newForm = [];
    for (let i = 0; i < form.length; i++) {
      if (
        (form[i].tagName === "INPUT" &&
          form[i].id !== "middle-name" &&
          form[i].id !== "street-address-2") ||
        (form[i].tagName === "SELECT" && form[i].id !== "prov-state")
      ) {
        newForm.push(form[i]);
      }
    }
    // end of for loop

    // then below, loop through the inputs, feed input IDs into this[inputId]() === "" to check for valid text
    // showErrorMessage same for all of them
    newForm.forEach(item => {
      // converting css class names into camelCase for their JS counterparts
      let id = this.getInputId(item.id);

      // check if the input is empty
      if (this[id]() === "") {
        // this is to create just 1 error for all 3 date of birth select elements
        if (id.match(/(dob)/g)) {
          this.showErrorMessage("dob");
        }

        this.showErrorMessage(id);
      }
    });
    // end of newForm.forEach

    // more specific error checks for specific input errors like password match
    this.checkEmailValid();
    this.checkPasswordMatch();
    this.checkProvState();
    this.scrollToError();

    // check for no errors - how?
    // if no errors at all:
    // this.addNewUser();
  };
  // end of checkInputs function

  this.checkEmailValid = () => {
    // email regex from W3C
    const emailCheck = RegExp(
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    );
    if (!emailCheck.test(this.email())) {
      this.showErrorMessage("email", "Please enter a valid email address.");
    }
  };

  this.checkPasswordMatch = () => {
    if (this.password1() !== this.password2()) {
      this.showErrorMessage("password2", "Your password doesn't match!");
    } else {
      this.showErrorMessage("password2", ""); // clear error message
    }
  };

  this.checkProvState = () => {
    // check for province/state - if it's not us/canada, dont give it an error
    // first need to determine if its US/Canada, then we do this check
    if (
      this.provState() === "Canada" ||
      this.provState() === "USA" ||
      this.provState() === ""
    ) {
      this.showErrorMessage("provState");
    }
  };

  // add new user to system once "Join now" button is pressed
  this.addNewUser = param => {
    console.log("form submitted!!👍");
    console.log(param); // what is this? dom node?

    // set user info (probably should have just made a user object with all these to begin with)
    const name = {
      firstName: this.firstName(),
      middleName: this.middleName(),
      lastName: this.lastName()
    };

    const dob = {
      year: this.dobYear(),
      month: this.dobMonth(),
      day: this.dobDay()
    };

    const address = {
      street1: this.streetAddress1(),
      street2: this.streetAddress2(),
      country: this.country(),
      provState: this.provState(),
      townCity: this.townCity(),
      postalZipCode: this.postalZipCode()
    };

    const contactInfo = {
      phoneType: this.phoneType(),
      phoneNumber: this.phoneNumber(),
      email: this.email()
    };

    const login = {
      email: this.email(),
      password: this.password1(),
      language: this.preferredLang()
    };

    // create new user
    const newUser = new User(
      name,
      this.gender(),
      dob,
      address,
      contactInfo,
      login
    );
    this.users.push(newUser);
    console.log(this.users());

    this.resetInputs();
  };

  // clear form once data has been submitted successfully
  this.resetInputs = function() {
    // login
    this.email("");
    this.password1("");
    this.password2("");

    // name
    this.firstName("");
    this.middleName("");
    this.lastName("");

    // gender & dob
    this.gender("");
    this.dobYear("");
    this.dobMonth("");
    this.dobDay("");

    // address
    this.isCanadaOrUS(true);
    this.streetAddress1("");
    this.streetAddress2("");
    this.country("");
    this.provState("");
    this.townCity("");
    this.postalZipCode("");

    // contact
    this.phoneType("");
    this.phoneNumber("");
    this.preferredLang("");
  };

  this.setUserCountry = function(country) {
    if (country !== "Canada" && country !== "USA") {
      this.isCanadaOrUS(false); // to hide prov/state options
    } else {
      this.isCanadaOrUS(true);
      if (this.provStateOptions().length > 0) {
        this.provStateOptions.splice(0); // removes previous options in dropdown
      }
      this.provStateData[country.toLowerCase()].forEach(item => {
        this.provStateOptions.push(item);
      });
    }
    this.country(country);
  };

  // one function for all select elements!
  this.handleSelectChange = (value, e) => {
    console.log(value);
    const id = this.getInputId(e.target.id);

    if (value !== undefined) {
      if (id === "country") {
        // determine which country & if we need to show/hide the province/state options
        this.setUserCountry(value);
      } else {
        this[id](value);
      }
      this.errors[id]("");
    } else if (value === undefined && id.match(/(dob)/g)) {
      this.showErrorMessage(id);
      this.showErrorMessage("dob");
    } else {
      // if there isn't a value
      this.showErrorMessage(id);
    }

    // need to clear error for general dob inputs (dunno if this needs to be a separate function???)
    if (id.match(/(dob)/g)) {
      if (
        this.errors.dobYear() === "" &&
        this.errors.dobMonth() === "" &&
        this.errors.dobDay() === ""
      ) {
        this.errors.dob("");
      }
    }
  };

  this.handleInputChange = (param, e) => {
    console.log(param); // what is this? comes out undefined, when used after a select, it's the select value!!!
    const id = this.getInputId(e.target.id);

    if (this[id] !== "") {
      this.errors[id]("");
    }
  };

  this.getInputId = cssClass => {
    const id = cssClass.replace(/-(\w)/g, function($1, $2) {
      return $2.toUpperCase();
    });
    return id;
  };

  this.scrollToError = () => {
    // set a variable to determine if form has errors
    this.errors.hasErrors(true);
    if (this.errors.hasErrors()) {
      // if true:
      // use querySelector to find first input with 'input-error' class,
      const id = document.querySelector(".input-error").id;
      console.log(id);
      // use the input id in label[for="id"]
      // scroll to the label
      if (id.match(/(dob)/g)) {
        document
          .querySelector(".dob-form-section")
          .scrollIntoView({ behavior: "smooth" });
      } else {
        console.log(document.querySelector(`label[for='${id}']`));
        document
          .querySelector(`label[for='${id}']`)
          .scrollIntoView({ behavior: "smooth" });
      }
    }
  };
}

// activate knockout
ko.applyBindings(new SignUpViewModel());

// Qs:
//  why did I have to user $root on certian things & not others in html? eg. genderOptions vs dobYearOptions?

// todo:
// - figure out where to call this.addNewUser() to complete the form submission!
