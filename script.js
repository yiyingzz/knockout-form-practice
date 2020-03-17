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
  console.log("it's all hooked up!");

  // uneditable data
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

  // editable data (user list)
  this.users = ko.observableArray([]);

  // operations (methods)

  // add new user to system once "Join now" button is pressed
  this.addNewUser = param => {
    console.log("form submitted!!👍");
    console.log(param); // what is this? dom node?

    // set user info
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
  };

  this.setUserCountry = function(country) {
    console.log(country);
    if (country !== "Canada" && country !== "USA") {
      this.isCanadaOrUS(false); // to hide prov/state options
    } else {
      this.isCanadaOrUS(true);
      if (this.provStateOptions().length > 0) {
        this.provStateOptions.splice(0); // removes previous
      }
      this.provStateData[country.toLowerCase()].forEach(item => {
        this.provStateOptions.push(item);
      });
    }
    this.country(country);
  };

  // one function for all select elements!
  this.handleSelectChange = (value, e) => {
    if (e.target.id === "country") {
      this.setUserCountry(value);
    } else if (e.target.id === "prov-state") {
      this.provState(value);
    } else if (e.target.id === "dob-year") {
      this.dobYear(value);
    } else if (e.target.id === "dob-month") {
      this.dobMonth(value);
    } else if (e.target.id === "dob-day") {
      this.dobDay(value);
    } else if (e.target.id === "phone-type") {
      this.phoneType(value);
    } else if (e.target.id === "preferred-lang") {
      this.preferredLang(value);
      console.log(this.preferredLang());
    }
  };
}

// activate knockout
ko.applyBindings(new SignUpViewModel());
