import * as ActivityLogger from '../utils/activity-log';

/**
 * Function to log new language added
 * @method newLangLogger
 * @param {String} user
 * @param {Object} data
 */
export function newLangLogger(user, data) {

    let log = {
      user,
      operation: 'ADD',
      message: `Added new language ${data.label} (${data.key})`,
      date: Date.now()
    };
  
    ActivityLogger.logActivity(log);
  }
  
  /**
   * Function to log if a key is deleted
   * @method deleteKeyLogger
   * @param {String} user
   * @param {Object} data
   */
  export function deleteKeyLogger(user, data) {
    let log = {
      user,
      operation: 'UPDATE',
      message: `Deleted key on the path ${data.keyPath}`,
      date: Date.now()
    };
  
    ActivityLogger.logActivity(log);
  }
  
  
  /**
   * Function to log if a key's value is updated
   * @method updateKeyValueLogger
   * @param {String} user
   * @param {Object} data
   */
  export function updateKeyValueLogger(user, data) {
    
    let log = {
      user,
      operation: 'UPDATE',
      message: `Updated key's ${data.key} for language ${data.lang}`,
      date: Date.now()
    };
  
    ActivityLogger.logActivity(log);
  }
  
  /**
   * Function to log if a new key is added
   * @method newKeyLogger
   * @param {String} user
   * @param {Object} data
   */
  export function newKeyLogger(user, data) {
    let log = {
      user,
      operation: 'ADD',
      message: `Added a new key ${data.key} to path ${data.keyPath}`,
      date: Date.now()
    };
  
    ActivityLogger.logActivity(log);
  }