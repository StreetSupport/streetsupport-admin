var ko = require('knockout')
var Address = require('./Address')

function SubCat(key, name) {
  var self = this
  self.key = key
  self.name = name
  self.isSelected = ko.observable(false)
}

function AddServiceProviderService() {
  var self = this

  self.categories = ko.observableArray(getCategories())
  self.category = ko.observable()
  self.subCategories = ko.observableArray()

  self.setAvailableSubCategories = function () {
    self.subCategories(self.category().subCategories.map(sc => new SubCat(sc.key, sc.name)))
  }

  var addresses = getAddressData().addresses.map(a => new Address(a))
  self.addresses = ko.observableArray(addresses)
  self.preselectedAddress = ko.observable()

  self.address = ko.observable(new Address({}))

  self.prefillAddress = function(a, b) {
    self.address(self.preselectedAddress())
  }

  self.save = function() {
    console.log('save!')
    console.log(self.category().name)
    console.log(self.address().street1())
    console.log(self.address().street2())
    console.log(self.address().street3())
    console.log(self.address().street4())
    console.log(self.address().city())
    console.log(self.address().postcode())

    self.address().openingTimes().forEach(ot => {
      console.log(ot.day() + ': ' + ot.startTime() + ' - ' + ot.endTime())
    })

    self.subCategories().forEach(sc => {
      if(sc.isSelected()) {
        console.log(sc.name)
      }
    })
  }
}

module.exports = AddServiceProviderService

function getAddressData() {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'addresses': [{
      'key': 1,
      'street': '5 Oak Street',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': 'Manchester',
      'postcode': 'M4 5JD',
      'openingTimes': [{
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Monday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Tuesday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Wednesday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Thursday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Friday'
      }]
    }, {
      'key': 2,
      'street': 'Another address',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': 'Manchester',
      'postcode': 'M1 2FY',
      'openingTimes': [{
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Monday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Tuesday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Wednesday'
      }]
    }]
  }
}


function getCategories() {
  return [{
    "key": "accom",
    "sortOrder": 90,
    "name": "Accommodation",
    "synopsis": "Permanent and temporary accomodation.",
    "subCategories": [{
      "key": "emergency",
      "name": "Emergency",
      "synopsis": "Emergency accomodation"
    }, {
      "key": "hostel",
      "name": "Hostel",
      "synopsis": "Hostel accomodation"
    }, {
      "key": "hosted",
      "name": "Hosted",
      "synopsis": "Hosted accomodation"
    }, {
      "key": "rented",
      "name": "Rented",
      "synopsis": "Rented accomodation in the private sector"
    }, {
      "key": "supported",
      "name": "Supported",
      "synopsis": "Supported lodgings"
    }, {
      "key": "social",
      "name": "Social Housing",
      "synopsis": "Social Housing"
    }, {
      "key": "shelter",
      "name": "Night shelter",
      "synopsis": "Night shelter"
    }],
    "documentCreationDate": "2015-12-16T16:12:49.8370000Z",
    "documentModifiedDate": "2015-12-16T16:12:49.8370000Z"
  }, {
    "key": "communications",
    "sortOrder": 0,
    "name": "Communications",
    "synopsis": "Internet and telephone access, and postal services.",
    "subCategories": [{
      "key": "telephone",
      "name": "Telephone",
      "synopsis": "Free telephone use"
    }, {
      "key": "internet",
      "name": "Internet access",
      "synopsis": "Internet access"
    }],
    "documentCreationDate": "2015-12-16T16:12:49.8370000Z",
    "documentModifiedDate": "2015-12-16T16:12:49.8370000Z"
  }, {
    "key": "dropin",
    "sortOrder": 70,
    "name": "Drop-In",
    "synopsis": "Day centres and social spaces that support homeless people.",
    "subCategories": [{
      "key": "general",
      "name": "Drop-In",
      "synopsis": "Day centres and social spaces that support homeless people."
    }],
    "documentCreationDate": "2015-12-16T16:12:49.8370000Z",
    "documentModifiedDate": "2015-12-16T16:12:49.8370000Z"
  }, {
    "key": "foodbank",
    "sortOrder": 0,
    "name": "Food Banks",
    "synopsis": "Free unprepared food for those on low incomes.",
    "subCategories": [{
      "key": "general",
      "name": "Food Banks",
      "synopsis": "Free unprepared food for those on low incomes."
    }],
    "documentCreationDate": "2015-12-16T16:12:49.8370000Z",
    "documentModifiedDate": "2015-12-16T16:12:49.8370000Z"
  }, {
    "key": "items",
    "sortOrder": 60,
    "name": "Personal Items",
    "synopsis": "Clothes, blankets, shoes, sleeping bags, and disposable goods including toiletries and sanitary products",
    "subCategories": [{
      "key": "clothes",
      "name": "Clothes",
      "synopsis": "Clothes and shoes"
    }, {
      "key": "blankets",
      "name": "Blankets",
      "synopsis": "Blankets"
    }, {
      "key": "towels",
      "name": "Towels",
      "synopsis": "Towels"
    }, {
      "key": "sleeping-bags",
      "name": "Sleeping Bags",
      "synopsis": "Sleeping bags"
    }, {
      "key": "toiletries",
      "name": "Toiletries",
      "synopsis": "Toiletries including sanitary products"
    }, {
      "key": "coats",
      "name": "Coats",
      "synopsis": "Waterproofs and warm coats"
    }, {
      "key": "gloves",
      "name": "Gloves & Scarves",
      "synopsis": "Gloves and scarves"
    }, {
      "key": "socks",
      "name": "Socks & pants",
      "synopsis": "Socks & pants"
    }, {
      "key": "tents",
      "name": "Tents",
      "synopsis": "Tents"
    }, {
      "key": "rucksacks",
      "name": "Rucksacks",
      "synopsis": "Rucksacks"
    }, {
      "key": "packs",
      "name": "Complete packs",
      "synopsis": "Packs containing various items distributed as a whole"
    }, {
      "key": "food",
      "name": "Dried food",
      "synopsis": "Packs of dried (cold) food"
    }],
    "documentCreationDate": "2015-12-16T16:12:49.8370000Z",
    "documentModifiedDate": "2015-12-16T16:12:49.8370000Z"
  }, {
    "key": "meals",
    "sortOrder": 80,
    "name": "Meals",
    "synopsis": "Hot meals and drinks.",
    "subCategories": [{
      "key": "general",
      "name": "Meals",
      "synopsis": "Hot meals and drinks."
    }],
    "documentCreationDate": "2015-12-16T16:12:49.8370000Z",
    "documentModifiedDate": "2015-12-16T16:12:49.8370000Z"
  }, {
    "key": "medical",
    "sortOrder": 40,
    "name": "Medical Services",
    "synopsis": "Doctors, dentists, mental health services ...",
    "subCategories": [{
      "key": "gp",
      "name": "General Practice",
      "synopsis": "General medical help"
    }, {
      "key": "nurse",
      "name": "Practice Nurse",
      "synopsis": "Practice Nurse"
    }, {
      "key": "dentist",
      "name": "Dentist",
      "synopsis": "Dental surgery"
    }, {
      "key": "mental-health",
      "name": "Mental Health",
      "synopsis": "Mental health practitioner"
    }],
    "documentCreationDate": "2015-12-16T16:12:49.8370000Z",
    "documentModifiedDate": "2015-12-16T16:12:49.8370000Z"
  }, {
    "key": "services",
    "sortOrder": 50,
    "name": "Personal Services",
    "synopsis": "Haircuts, laundry, showers, religious services ...",
    "subCategories": [{
      "key": "laundry",
      "name": "Laundry",
      "synopsis": "Clothes washing service"
    }, {
      "key": "shower",
      "name": "Showers",
      "synopsis": "Hot showers"
    }, {
      "key": "haircut",
      "name": "Haircuts",
      "synopsis": "Haircuts"
    }],
    "documentCreationDate": "2015-12-16T16:12:49.8370000Z",
    "documentModifiedDate": "2015-12-16T16:12:49.8370000Z"
  }, {
    "key": "training",
    "sortOrder": 0,
    "name": "Training",
    "synopsis": "Formal and informal skill shares and workshops, and support getting employment.",
    "subCategories": [{
      "key": "general",
      "name": "Training and workshops",
      "synopsis": "Formal and informal skill shares and workshops, and support getting employment."
    }],
    "documentCreationDate": "2015-12-16T16:12:49.8370000Z",
    "documentModifiedDate": "2015-12-16T16:12:49.8370000Z"
  }, {
    "key": "support",
    "sortOrder": 100,
    "name": "Support",
    "synopsis": "Support, advice, and help with referrals.",
    "subCategories": [{
      "key": "general",
      "name": "General support",
      "synopsis": "General support and advice."
    }, {
      "key": "dependency",
      "name": "Dependency support",
      "synopsis": "Help with drug and alcohol addiction."
    }, {
      "key": "housing",
      "name": "Housing support",
      "synopsis": "Help with accomodation and related referral services."
    }, {
      "key": "lgbt",
      "name": "LGBT support",
      "synopsis": "Support for people who are LGBT+."
    }, {
      "key": "sexwork",
      "name": "Sex worker support",
      "synopsis": "Support for sex workers"
    }, {
      "key": "asylum",
      "name": "Asylum seeker support",
      "synopsis": "Support for asylum seekers and refugees"
    }, {
      "key": "older-people",
      "name": "Support for older people",
      "synopsis": "Support for older people"
    }, {
      "key": "younger-people",
      "name": "Support for younger people",
      "synopsis": "Support for younger people"
    }, {
      "key": "health",
      "name": "Health service advice",
      "synopsis": "Help accessing health services"
    }, {
      "key": "employment",
      "name": "Employment advice",
      "synopsis": "Advice getting into work"
    }, {
      "key": "benefits",
      "name": "Benefit advice",
      "synopsis": "Advice with benefit payments"
    }, {
      "key": "veteran",
      "name": "Veterans' support",
      "synopsis": "Support for military veterans"
    }, {
      "key": "ex-offender",
      "name": "Ex-Offenders' support",
      "synopsis": "Support for prisoners, ex-offenders, and people at risk of offending"
    }],
    "documentCreationDate": "2015-12-16T16:12:49.8350000Z",
    "documentModifiedDate": "2015-12-16T16:12:49.8350000Z"
  }]
}
