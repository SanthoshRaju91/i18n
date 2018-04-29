import FileDB from "../../utils/FileDB";
import logger from "../../utils/logger";

/**
 * Function for adding new language to the translation manager, FILEDB.
 * @method addNewLanguage
 * @param data
 */
const addNewLanguage = data => {
  return new Promise((resolve, reject) => {    
    try {
      
      let langInstance = new FileDB("language.json");
      let lang = langInstance.getData();
      let exists = lang.find(current => current.key === data.key) || {};

      if (Object.keys(exists).length > 0) {
        throw 'Already exists';
      } else {
        let translationInstance = new FileDB(`translations/${data.key}.json`);

        // updating the language JSON
        let { key, label, translation } = data;

        lang.push({
          key,
          label
        });

        langInstance.writeData(lang);
        //adding translation content to the translation file
        translationInstance.writeData(translation);
        resolve();
      }
    } catch (err) {
      logger.error(`Something went wrong while adding new translation` + err);
      reject(err);
    }
  });
};

export default addNewLanguage;
