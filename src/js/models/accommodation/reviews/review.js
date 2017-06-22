import * as ko from 'knockout'

const readOnlyFields = ['id', 'temporaryAccommodationId']
const zeroFields = ['hasCentralHeating', 'hasHotWater', 'hasElectricity', 'hasToilet', 'hasShowerBath',
  'feelingOfSecurityRating', 'noisyRating', 'foodRating', 'cleanlinessRating', 'roomConditionRating',
  'staffFriendlinessRating', 'staffSupportivenessRating', 'staffDealingWithProblemsRating', 'staffTimelinessWithIssuesRating',
  'overallRating']
const falseFields = ['hasLockOnRoom', 'hasLockOnFrontDoor']

export const buildModel = function (data) {
  const formattedCreationDate = data.documentCreationDate !== undefined
    ? data.documentCreationDate.split('T')[0]
    : ''
  const obj = {}
  readOnlyFields
    .forEach((f) => {
      obj[`${f}ReadOnly`] = ko.observable(data[f])
    })
  zeroFields.concat(falseFields)
    .forEach((f) => {
      obj[f] = ko.observable(data[f])
    })
  obj.documentCreationDateReadOnly = ko.observable(formattedCreationDate)

  return obj
}

export const buildFeedback = function (data) {
  return {
    idReadOnly: ko.observable(data.id),
    temporaryAccommodationIdReadOnly: ko.observable(data.temporaryAccommodationId),
    canBeDisplayedPublically: ko.observable(data.canBeDisplayedPublically),
    reviewerName: ko.observable(data.reviewerName),
    reviewerContactDetails: ko.observable(data.reviewerContactDetails),
    body: ko.observable(data.body)
  }
}

export const createDefaultNewItem = function (accomId) {
  const defaultNewItem = {
    id: null,
    temporaryAccommodationId: accomId,
    documentCreationDate: new Date().toISOString()
  }

  zeroFields.forEach((f) => { defaultNewItem[f] = 0 })
  falseFields.forEach((f) => { defaultNewItem[f] = false })

  return defaultNewItem
}

export const createDefaultNewFeedback = function () {
  return {
    canBeDisplayedPublically: false,
    reviewerName: '',
    reviewerContactDetails: '',
    body: ''
  }
}
