const options = {
  insertMessages: true,
  decorateInputElement: true,
  parseInputAttributes: true,
  errorMessageClass: 'form__error',
  errorElementClass: 'form__input--error'
}

const initialise = function (koValidation) {
  koValidation.init(options, true)
}

const getValidationGroup = function (koValidation, formModel) {
  return koValidation.group(formModel)
}

const showErrors = function (koValidationGroup) {
  koValidationGroup.showAllMessages()
  const validationMessages = document.querySelectorAll(`.${options.errorMessageClass}`)
  for (const error of validationMessages) {
    if (error.style.display !== 'none') {
      error.previousSibling.focus()
      break
    }
  }
}

const buildPayload = function (koFormFields) {
  const payload = {}
  Object.keys(koFormFields)
    .forEach((k) => {
      if (!k.endsWith('ReadOnly')) {
        const key = `${k.charAt(0).toUpperCase()}${k.substr(1)}`
        payload[key] = koFormFields[k]()
      }
    })
  return payload
}

module.exports = {
  initialise: initialise,
  getValidationGroup: getValidationGroup,
  showErrors: showErrors,
  buildPayload: buildPayload
}
