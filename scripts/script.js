// a Class for user object
function User(name, gender, dob, address, contactInfo, login) {
  const self = this;
  self.name = name;
  self.gender = gender;
  self.dob = dob;
  self.address = address;
  self.contactInfo = contactInfo;
  self.login = login;
}

// viewmodel - this is the js/data that goes with the page
function SignUpViewModel() {
  // options for the select dropdowns
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
  this.tooltip = ko.observable();

  // INPUT VALUES (user info)
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

  // terms agreement
  this.terms = ko.observable(false);

  // ERROR OBJECT
  this.errors = {
    hasErrors: ko.observable(false),
    email: ko.observable(""),
    password1: ko.observable(""),
    password2: ko.observable(""),
    firstName: ko.observable(""),
    lastName: ko.observable(""),
    gender: ko.observable(""),
    dobYear: ko.observable(""),
    dobMonth: ko.observable(""),
    dobDay: ko.observable(""),
    dob: ko.observable(""),
    streetAddress1: ko.observable(""),
    country: ko.observable(""),
    provState: ko.observable(""),
    townCity: ko.observable(""),
    postalZipCode: ko.observable(""),
    phoneType: ko.observable(""),
    phoneNumber: ko.observable(""),
    preferredLang: ko.observable(""),
    terms: ko.observable("")
  };

  // SUCESSFUL SUBMISSION
  this.submitted = ko.observable(false);

  // METHODS
  this.showErrorMessage = function (id, message = "This field is required.") {
    const warningIcon = ` 
    <svg class="icon-warning" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
      <path fill="#000000" d="M8 1.45l6.705 13.363h-13.409l6.705-13.363zM8 0c-0.345 0-0.69 0.233-0.951 0.698l-6.829 13.611c-0.523 0.93-0.078 1.691 0.989 1.691h13.583c1.067 0 1.512-0.761 0.989-1.691h0l-6.829-13.611c-0.262-0.465-0.606-0.698-0.951-0.698v0z"></path>
      <path fill="#000000" d="M9 13c0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.552 0.448-1 1-1s1 0.448 1 1z"></path>
      <path fill="#000000" d="M8 11c-0.552 0-1-0.448-1-1v-3c0-0.552 0.448-1 1-1s1 0.448 1 1v3c0 0.552-0.448 1-1 1z"></path>
    </svg> 
    `;
    this.errors[id](warningIcon + message);
  };

  this.submitForm = (e) => {
    // close tooltip if open
    if (this.tooltip()) {
      this.toggleTooltip();
    }

    // reset in case user is re-submitting
    this.errors.hasErrors(false);

    // check for blank inputs
    this.checkInputs(e);
  };

  // This just checks for blank inputs, then calls the more specific error checking functions
  this.checkInputs = (form) => {
    // loop through list to grab all input & select nodes
    let inputs = [];
    for (let i = 0; i < form.length; i++) {
      if (
        (form[i].tagName === "INPUT" &&
          form[i].id !== "middle-name" &&
          form[i].id !== "street-address-2") ||
        (form[i].tagName === "SELECT" && form[i].id !== "prov-state")
      ) {
        inputs.push(form[i]);
      }
    }
    // end of for loop

    // then below, loop through the inputs, feed input IDs into this[inputId]() === "" to check for valid text
    // showErrorMessage same for all of them
    inputs.forEach((item) => {
      // converting css class names into camelCase for their JS counterparts
      let id = this.getInputId(item.id);
      // check if the input is empty or false
      if (
        this[id]() === "" ||
        this[id]() === false ||
        this[id]() === undefined
      ) {
        // this is to create just 1 error for all 3 date of birth select elements
        if (id.match(/(dob)/g)) {
          this.showErrorMessage("dob");
        }
        this.showErrorMessage(id);
      }
    });
    // end of newForm.forEach

    // more specific error checks for specific input errors like password match
    if (this.email() !== "") {
      this.checkEmailValid();
    }

    if (this.password1() !== "") {
      this.checkPasswordMatch();
    }

    if (this.country() === "Canada" || this.country() === "USA") {
      this.checkProvState();
    }

    this.checkForErrors();
  };
  // end of checkInputs function

  this.checkEmailValid = () => {
    // email regex from emailregex.com
    const emailCheck = RegExp(
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    );
    if (!emailCheck.test(this.email())) {
      this.showErrorMessage("email", "Please enter a valid email address.");
    }
  };

  this.checkPasswordMatch = () => {
    if (this.password1() !== this.password2()) {
      this.showErrorMessage("password2", "Your password doesn't match!");
    } else {
      this.errors.password2(""); // clear error message
    }
  };

  this.checkProvState = () => {
    if (this.provState() === "" || this.provState() === undefined) {
      this.showErrorMessage("provState");
    }
  };

  // add new user to system
  this.addNewUser = () => {
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

    // display submitted data in console:
    console.log("New user registered!!👍");
    console.log(newUser);
    this.submitted(true); // show success message

    this.resetInputs();
  };

  // clear form once data has been submitted successfully
  this.resetInputs = () => {
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

    // terms
    this.terms(false);
  };

  this.setUserCountry = function (country) {
    if (country !== "Canada" && country !== "USA") {
      this.isCanadaOrUS(false); // to hide prov/state options
    } else {
      this.isCanadaOrUS(true);
      if (this.provStateOptions().length > 0) {
        this.provStateOptions.splice(0); // removes previous options in dropdown
      }
      this.provStateOptions([...this.provStateData[country.toLowerCase()]]);
    }
    this.country(country);
  };

  // one function for all select elements!
  this.handleSelectChange = (val, e) => {
    const id = this.getInputId(e.target.id);
    const value = e.target.value;

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

    // need to clear error for general dob inputs
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
    // console.log(param); // this is the input value, initially undefined as no input exists, after typing something in it will be the input value
    // generally knockout event functions seem to use $data as the first param, event as the 2nd --> in this case, b/c it's a select input, the data is the value???
    const id = this.getInputId(e.target.id);
    if (this[id] !== "") {
      this.errors[id]("");
    }
  };

  this.getInputId = (cssClass) => {
    const id = cssClass.replace(/-(\w)/g, function ($1, $2) {
      return $2.toUpperCase();
    });
    return id;
  };

  // after each submission - loop through this.errors to find if errors exist
  // if everything is empty, set this.errors.hasError to false, if one thing is true, set this.errors.hasError to true
  this.checkForErrors = () => {
    // Object.values lets us get the value of the key-value pairs on the errors object
    const errorItems = Object.values(this.errors);

    for (let i = 1; i < errorItems.length; i++) {
      if (errorItems[i]() !== "") {
        this.errors.hasErrors(true);
        break; // break on the first error, no need to check the rest
      }
    }

    if (!this.errors.hasErrors()) {
      this.addNewUser();
    } else {
      this.scrollToError();
    }
  };

  this.scrollToError = () => {
    // use querySelector to find first input with 'input-error' class,
    const id = document.querySelector(".input-error").id;

    // use the input id in label[for="id"]
    // scroll to the label
    if (id.match(/(dob)/g)) {
      document.querySelector(".form-control__dob").scrollIntoView();
    } else {
      document
        .querySelector(`label[for="${id}"]`)
        .parentElement.scrollIntoView();
    }
  };

  this.toggleTooltip = () => {
    if (!this.tooltip()) {
      this.tooltip(true);
    } else {
      this.tooltip(false);
    }
  };
}

// activate knockout - bind all this to the page (I guess it keeps it contained?)
ko.applyBindings(new SignUpViewModel());
