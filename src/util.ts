/**
 * Upper-case the first letter of a string
 */
export const capitalize = ([first, ...rest]: string) =>
  [first?.toLocaleUpperCase(), ...rest].join('')
