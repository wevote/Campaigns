/**
 * @param originalString
 * @param numberOfWordsToReturn
 * @returns {string}
 */
export default function returnFirstXWords (originalString, numberOfWordsToReturn) {
  if (!originalString) return '';

  const wordsArray = originalString.split(' ');
  let xWords = '';
  for (let i = 0; i < wordsArray.length; i++) {
    if (i >= numberOfWordsToReturn) {
      break;
    }
    xWords += `${wordsArray[i]} `;
  }
  // Finally remove leading or trailing spaces
  xWords = xWords.trim();

  return xWords;
}
