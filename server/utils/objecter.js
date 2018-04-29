import { detailedDiff } from 'deep-object-diff';

/**
 * setting the path for object, from the path string.
 * @method setByPath
 * @param obj - Object
 * @param path - object path string to be set
 * @param value - Value to be set for the object path key
*/
export default function setByPath(obj, path, value) {
  var parts = path.split('.');
  var o = obj;
  if (parts.length > 1) {
    for (var i = 0; i < parts.length - 1; i++) {
      if (!o[parts[i]]) o[parts[i]] = {};
      o = o[parts[i]];
    }
  }

  o[parts[parts.length - 1]] = value;
}

/**
 * deleting the key of an object by path string
 * @method deleteByPath
 * @param obj - Object
 * @param path - object path key to delete
*/
export function deleteByPath(obj, path) {
  var parts = path.split('.');
  var o = obj;

  if (parts.length > 1);
  for (var i = 0; i < parts.length - 1; i++) {
    if (!o[parts[i]]) o[parts[i]] = {};
    o = o[parts[i]];
  }

  delete o[parts[parts.length - 1]];
  return obj;
}


function getDeepKeys(obj) {
  var keys = [];
  for(var key in obj) {
      keys.push(key);
      if(typeof obj[key] === "object") {
          var subkeys = getDeepKeys(obj[key]);
          keys = keys.concat(subkeys.map(function(subkey) {
              return key + "." + subkey;
          }));
      }
  }
  return keys;
}

/**
 * Function to get the deepest key path.
 * @param {Object} obj 
 */

export function getKeyPath(obj) {
  const deeperKeyPath = getDeepKeys(obj)[getDeepKeys(obj).length - 1];
  return deeperKeyPath;
}
/**
 * To check if the original obj and updated obj resulted in only update of a key's value
 * @method checkForUpdate
 * @param {Object} updatedObj
 * @param {Object} originalObj
 */
export function checkForUpdate(originalObj, updatedObj) {
  let details = detailedDiff(originalObj, updatedObj);

  let { added, deleted, updated } = details;

  if(Object.keys(added).length > 0) {
    return {
      updated: false,
      translation: originalObj
    };
  } else if (Object.keys(deleted).length > 0) {
    return {
      updated: false,
      translation: originalObj
    };
  } else if(Object.keys(updated).length > 0) {
    return {
      updated: true,
      translation: updatedObj,
      key: updated
    };
  } else {
    return {
      updated: false,
      same: true
    };
  }
}