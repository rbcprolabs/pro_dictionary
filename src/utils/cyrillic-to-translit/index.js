import associations from './table'

/**
 * Transform cyrillic text to translit
 * @param {string} input
 * @param {string=} spaceReplacement
 * @returns {string}
 */
export default function cyrillicToTranslit(input, spaceReplacement) {
  if (!input) return ''

  let newStr = ''
  for (let i = 0; i < input.length; i++) {
    const isUpperCaseOrWhatever = input[i] === input[i].toUpperCase()
    let strLowerCase = input[i].toLowerCase()
    if (strLowerCase === ' ' && spaceReplacement) {
      newStr += spaceReplacement
      continue
    }
    let newLetter = associations[strLowerCase]
    newStr += ('undefined' === typeof newLetter)
      ? isUpperCaseOrWhatever ? strLowerCase.toUpperCase() : strLowerCase
      : isUpperCaseOrWhatever ? newLetter.toUpperCase() : newLetter
  }
  return newStr
}
