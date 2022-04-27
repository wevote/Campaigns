// textFormat.js

export function abbreviateNumber (num) {
  // =< 1,000,000 - round to hundred-thousand (1.4M)
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  // 100,000 – 999,999 - round to nearest thousand (847K)
  if (num >= 100000) {
    return `${(num / 1000).toFixed(0).replace(/\.0$/, '')}K`;
  }
  // 10,000 – 99,999 - round to single decimal (45.8K)
  if (num >= 10000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  // < 10,000 - add comma for thousands (3,857)
  if (num < 10000) {
    const stringNum = num.toString();
    return stringNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return num;
}

// We assume that arrayHaystack contains objects with one property with the name in needleProperty
// When we find the first object in the arrayHaystack, replace it with the newObject
export function arrayReplaceObjectMatchingPropertyValue (needleValue, needleProperty, arrayHaystack, newObject) {
  let objectWasReplaced = false;
  const indexOfExistingObject = arrayHaystack.findIndex((existingObject) => existingObject[needleProperty] === needleValue);
  if (indexOfExistingObject !== -1) {
    arrayHaystack.splice(indexOfExistingObject, 1, newObject);
    objectWasReplaced = true;
  }
  // console.log('objectWasReplaced: ', objectWasReplaced, ', indexOfExistingObject:', indexOfExistingObject);
  return {
    objectWasReplaced,
    arrayHaystack,
  };
}

// Gives preference to the earlier entry in the incoming array
export function arrayUnique (array) {
  const a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }
  return a;
}

export function convertNameToSlug (incomingString) {
  // This is used to turn issue/value names into URL paths
  if (!incomingString || incomingString === '') {
    return '';
  }
  let convertedString = incomingString.toLowerCase();
  convertedString = convertedString.split(' ').join('_');
  convertedString = convertedString.split('&_').join('_');
  convertedString = convertedString.split('/_').join('_');
  // console.log('convertedString: ', convertedString);
  return convertedString;
}

export function cleanArray (actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

export function convertToInteger (incomingNumber) {
  return parseInt(incomingNumber, 10) || 0;
}

export function elipses (name, mobile) {
  function cut (position) {
    return name.length < position ? name : `${name.slice(0, position)}...`;
  }
  return mobile ? cut(3) : cut(8);
}

export function extractTwitterHandleFromTextString (incomingString) {
  if (!incomingString || incomingString === '') {
    return '';
  }
  let lowerCaseString = incomingString.toLowerCase();
  lowerCaseString = lowerCaseString.replace('http://twitter.com', '');
  lowerCaseString = lowerCaseString.replace('http://www.twitter.com', '');
  lowerCaseString = lowerCaseString.replace('https://twitter.com', '');
  lowerCaseString = lowerCaseString.replace('https://www.twitter.com', '');
  lowerCaseString = lowerCaseString.replace('www.twitter.com', '');
  lowerCaseString = lowerCaseString.replace('twitter.com', '');
  lowerCaseString = lowerCaseString.replace('@', '');
  lowerCaseString = lowerCaseString.replace('/', '');
  return lowerCaseString;
}

export function isNumber (value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isString (value) {
  return typeof value === 'string' || value instanceof String;
}

export function isValidUrl (incomingString) {
  const incomingStringTrimmed = incomingString.trim();
  const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  return regexp.test(incomingStringTrimmed);
}

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * Duplicate values in the second object will overwrite those in the first
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
export function mergeTwoObjectLists (obj1, obj2) {
  const obj3 = {};
  Object.keys(obj1).forEach((key) => {
    if ({}.hasOwnProperty.call(obj1, key)) {
      obj3[key] = obj1[key];
    }
  });

  Object.keys(obj2).forEach((key) => {
    if ({}.hasOwnProperty.call(obj2, key)) {
      obj3[key] = obj2[key];
    }
  });

  return obj3;
}

export function numberWithCommas (rawNumber) {
  if (rawNumber === 0) {
    return 0;
  } else if (rawNumber) {
    const parts = rawNumber.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  } else {
    return '';
  }
}

function startsWithLocal (needle, incomingString) {
  // IE 10 does not support the "string.startsWith" function.  DO NOT USE THAT FUNCTION
  // console.log("startsWith, needle:", needle, ", haystack: ", incomingString);
  if (incomingString) {
    return incomingString.indexOf(needle) === 0;
  } else {
    return false;
  }
}

// If Display name is repeated in beginning of the description, remove the name from the description (along with trailing 'is') and capitalize next word to begin description.
export function removeTwitterNameFromDescription (displayName, twitterDescription) {
  const displayNameNotNull = displayName || '';
  const twitterDescriptionNotNull = twitterDescription || '';
  let twitterDescriptionMinusName;

  if (startsWithLocal(displayNameNotNull, twitterDescriptionNotNull)) {
    twitterDescriptionMinusName = twitterDescriptionNotNull.substr(displayNameNotNull.length);
  } else if (startsWithLocal(`The ${displayNameNotNull}`, twitterDescriptionNotNull)) {
    twitterDescriptionMinusName = twitterDescriptionNotNull.substr(displayNameNotNull.length + 4);
  } else if (twitterDescriptionNotNull.length) {
    twitterDescriptionMinusName = twitterDescriptionNotNull;
  } else {
    twitterDescriptionMinusName = '';
  }
  if (startsWithLocal(', ', twitterDescriptionMinusName)) {
    twitterDescriptionMinusName = twitterDescriptionMinusName.substr(2);
  }
  if (startsWithLocal(': ', twitterDescriptionMinusName)) {
    twitterDescriptionMinusName = twitterDescriptionMinusName.substr(2);
  }
  return twitterDescriptionMinusName;
}

export function sentenceCaseString (incomingString) {
  if (!incomingString || incomingString === '') {
    return '';
  }
  const incomingStringLowerCase = incomingString.toLowerCase();
  const stringArray = incomingStringLowerCase.split('.');
  let finalString = '';
  let count;
  let count2;
  for (count = 0; count < stringArray.length; count++) {
    let spaceput = '';
    const spaceCount = stringArray[count].replace(/^(\s*).*$/, '$1').length;
    stringArray[count] = stringArray[count].replace(/^\s+/, '');
    const newString = stringArray[count].charAt(stringArray[count]).toUpperCase() + stringArray[count].slice(1);
    for (count2 = 0; count2 < spaceCount; count2++) {
      spaceput = `${spaceput} `;
    }
    finalString = `${finalString + spaceput + newString}.`;
  }
  finalString = finalString.substring(0, finalString.length - 1);
  return finalString;
}

export function shortenText (incomingString, maximumLength) {
  if (!incomingString || incomingString === '') {
    return '';
  }
  const maximumLengthInteger = parseInt(maximumLength, 10);
  if (maximumLengthInteger < 1) {
    return '';
  }
  let cropLengthToMakeRoomForEllipses = maximumLengthInteger - 2;
  // Don't allow the string to use less than 3 characters
  const minimumCharactersToDisplay = 3;
  cropLengthToMakeRoomForEllipses = cropLengthToMakeRoomForEllipses > 2 ? cropLengthToMakeRoomForEllipses : minimumCharactersToDisplay;
  if (incomingString.length >= maximumLengthInteger) {
    const incomingStringShortened = incomingString.slice(0, cropLengthToMakeRoomForEllipses);
    return `${incomingStringShortened.trim()}...`;
  } else {
    return incomingString;
  }
}

export function stringContains (needle, stringHaystack) {
  // console.log("stringContains, needle:", needle, ", haystack: ", stringHaystack);
  if (stringHaystack) {
    return stringHaystack.indexOf(needle) !== -1;
  } else {
    return false;
  }
}

export function stripHtmlFromString (incomingString) {
  if (!incomingString || incomingString === '') {
    return '';
  }
  let strippedString = incomingString.replace(/&nbsp;/gi, ' ');
  strippedString = strippedString.replace(/<br>/gi, ' ');
  strippedString = strippedString.split(/<[^<>]*>/).join(''); // Strip away any HTML tags
  return strippedString;
}

export const youTubeRegX = /(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/;
export const vimeoRegX = /http(s)?:\/\/(www\.)?vimeo.com\/(\d+)(\/)?(#.*)?/;

// This must be placed after declaration of stringContains
export function isProperlyFormattedVoterGuideWeVoteId (voterGuideWeVoteId) {
  return voterGuideWeVoteId && stringContains('wv', voterGuideWeVoteId) && stringContains('vg', voterGuideWeVoteId);
}

export function getBooleanValue (thing) {
  if (thing === undefined) {
    return false;
  } else if (typeof thing === 'boolean') {
    return thing;
  } else if (typeof thing === 'string') {
    return thing === 'true';
  } else {
    return false;
  }
}
