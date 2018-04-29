import logger from "../../utils/logger";
import FileDB from "../../utils/FileDB";
import setByPath, { checkForUpdate } from "../../utils/objecter";
import { getKeyPath } from '../../utils/objecter';

/**
 * Function to update given key's value for the selected language.
 * @method updateKeysValue
 * @param data
 */
const updateKeysValue = data => {
  return new Promise((resolve, reject) => {
    let { lang, translation } = data;

    if (lang && translation) {
      let langInstance = new FileDB(`translations/${lang}.json`);

      let orgTranslation = langInstance.getData();

      let result = checkForUpdate(orgTranslation, translation);

      if (result.updated) {
        langInstance.writeData(translation);
                
        resolve({
          key: getKeyPath(result.key)
        });
      } else {
        if(result.same) {
          reject('Nothing to update');
        }
        reject(
          "Original translaton is being tampered with add / delete operation"
        );
      }
    } else {
      reject("Missing required keys");
    }
  });
};

export default updateKeysValue;
