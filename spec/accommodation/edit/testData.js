module.exports = {
  testData: {
    'generalInfo': {
      'name': 'name',
      'synopsis': 'synopsis',
      'description': 'description',
      'isOpenAccess': true,
      'isPubliclyVisible': false,
      'accommodationType': 'accommodation type',
      'serviceProviderId': 'service-provider-id'
    },
    'contactInformation': {
      'name': 'Vince Test',
      'additionalInfo': 'additionalInfo',
      'email': 'test@test.com',
      'telephone': 'telephone'
    },
    'address': {
      'street1': 'street line 1',
      'street2': 'street line 2',
      'street3': 'street line 3',
      'city': 'city',
      'postcode': 'm1 3fy',
      'latitude': 0,
      'longitude': 0,
      'publicTransportInfo': 'public transport info',
      'nearestSupportProviderId': 'provider-b'
    },
    'features': {
      'acceptsPets': 2,
      'acceptsCouples': 2,
      'hasDisabledAccess': 2,
      'hasSingleRooms': 2,
      'hasSharedRooms': 2,
      'hasShowerBathroomFacilities': 2,
      'hasAccessToKitchen': 2,
      'hasFlexibleMealTimes': 2,
      'hasLounge': 2,
      'providesCleanBedding': 2,
      'allowsVisitors': 2,
      'additionalFeatures': 'additional features',
      'availabilityOfMeals': 'availability of meals',
      'hasLaundryFacilities': 2
    },
    'pricingAndRequirements': {
      'referralIsRequired': true,
      'referralNotes': 'referral notes',
      'price': 12.34,
      'foodIsIncluded': 2,
      'availabilityOfMeals': 'availability of meals',
      'featuresAvailableAtAdditionalCost': 'features available at additional cost'
    },
    'supportProvided': {
      'hasOnSiteManager': 2,
      'supportInfo': 'support info',
      'supportOffered': [ 'support a', 'support b' ]
    },
    'residentCriteria': {
      acceptsMen: true,
      acceptsWomen: true,
      acceptsCouples: true,
      acceptsSingleSexCouples: true,
      acceptsYoungPeople: true,
      acceptsFamilies: true,
      acceptsBenefitsClaimants: true
    },
    'id': '589a08ad6a38c32e883f26df',
    'documentCreationDate': '2017-02-07T17:49:33.2570000Z',
    'documentModifiedDate': '2017-02-07T17:49:33.2570000Z'
  },
  publishedServiceProviderData: [
    { key: 'provider-a', name: 'Provider A' },
    { key: 'provider-b', name: 'Provider B' },
    { key: 'provider-c', name: 'Provider C' },
    { key: 'provider-d', name: 'Provider D' },
    { key: 'provider-e', name: 'Provider E' },
    { key: 'provider-f', name: 'Provider F' }
  ],
  allServiceProviderData: {
    items: [
      { key: 'provider-a', name: 'Provider A' },
      { key: 'provider-b', name: 'Provider B' },
      { key: 'provider-c', name: 'Provider C' },
      { key: 'provider-d', name: 'Provider D' },
      { key: 'provider-e', name: 'Provider E' },
      { key: 'provider-f', name: 'Provider F' }
    ]
  }
}
