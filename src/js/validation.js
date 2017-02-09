var initialise = function (koValidation) {
  koValidation.init({
    insertMessages: true,
    decorateInputElement: true,
    parseInputAttributes: true,
    errorMessageClass: 'form__error',
    errorElementClass: 'form__input--error'
  }, true)
}

var getValidationGroup = function (koValidation, formModel) {
  return koValidation.group(formModel)
}

var showErrors = function (koValidationGroup) {
  koValidationGroup.showAllMessages()
  const validationMessages = document.querySelectorAll('.validationMessage')
  validationMessages[0].previousSibling.focus()
}

const buildPayload = function (koFormFields) {
  const payload = {}
  Object.keys(koFormFields)
    .forEach((k) => {
      const key = `${k.charAt(0).toUpperCase()}${k.substr(1)}`
      payload[key] = koFormFields[k]()
    })
  return payload
}

module.exports = {
  initialise: initialise,
  getValidationGroup: getValidationGroup,
  showErrors: showErrors,
  buildPayload: buildPayload
}
