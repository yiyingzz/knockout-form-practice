// a Class for user object with user info
// we would need to pass in a LOT of info though!!!
function User(firstName, lastName) {
  const self = this;

  self.firstName = firstName;
  self.lastName = lastName;

  self.name = `${self.firstName} ${self.lastName}`;
}

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
  this.countryOptions = ["Canada", "USA", "China", "Cuba", "France"];
  this.provStateOptions = ko.observableArray([]);
  this.provStateData = {
    canada: ["Alberta", "Ontario", "Prince Edward Island", "Quebec"],
    usa: ["New York", "Florida", "California", "Minnesota", "Maryland"]
  };

  // input values
  this.firstName = ko.observable("");
  this.middleName = ko.observable("");
  this.lastName = ko.observable("");

  this.streetAddress1 = ko.observable("");
  this.streetAddress2 = ko.observable("");

  // editable data
  this.users = ko.observableArray([]);

  // operations (methods)
  this.addNewUser = (num, e) => {
    console.log(num); // not the event??? it's an number 1 // viewmodel number?
    console.log(e); // event is 2nd param

    // grab form info
    const newUser = new User(this.firstName(), this.lastName());
    this.users.push(newUser);
  };

  // once user selects a country, update the options for province/state
  this.handleCountryChange = (selectedCountry, e) => {
    console.log(selectedCountry); // selection value
    console.log(e); // event object
    console.log(selectedCountry.toLowerCase());

    // this.provStateOptions = this.provStateData[selectedCountry.toLowerCase()];
    // console.log(this);
    console.log(this.provStateOptions()); // not dynamically updating the select although you can see it changes in the console

    // must use push/splice for observable arrays? since the above doesn't work
    // also needs to remove everything first if the user keeps changing countries (pop everything?)
    this.provStateData[selectedCountry.toLowerCase()].forEach(item => {
      this.provStateOptions.push(item);
    });
  };
}

// activate knockout
ko.applyBindings(new SignUpViewModel());
