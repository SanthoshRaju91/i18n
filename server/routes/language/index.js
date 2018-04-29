import { Router } from "express";
import logger from "../../utils/logger";

import {
  newLangLogger,
  deleteKeyLogger,
  updateKeyValueLogger,
  newKeyLogger
} from "../../modules/activity-logger";

import {
  addNewLanguageAPI,
  addNewKeyAPI,
  updateKeysValueAPI,
  deleteKeyAPI,
  getTranslation,
  getLanguages
} from "../../modules/api-language";

import {
  getLastActivity,
  getActivities
} from '../../utils/activity-log';

const LanguageRoutes = new Router();

LanguageRoutes.post("/addNewLanguage", (req, res, next) => {
  try {
    let { data } = req.body;

    let addResponse = addNewLanguageAPI(data);

    if (addResponse) {
      newLangLogger(req.username, data);

      res.status(200).json({
        success: true,
        message: "New language added"
      });
    } else {
      throw "Could not add new language";
    }
  } catch (err) {
    next(err);
  }
});

LanguageRoutes.post("/addNewKey", (req, res, next) => {
  try {
    let { data } = req.body;

    console.log(data);
    let newKey = addNewKeyAPI(data);

    if (newKey) {
      newKeyLogger(req.username, data);

      res.status(200).json({
        success: true,
        message: "New key added to the path"
      });
    } else {
      throw "Could not add new key";
    }
  } catch (err) {
    next(err);
  }
});

LanguageRoutes.get("/getTranslation/:lang", async (req, res, next) => {
  try {
    let { lang } = req.params;

    let translations = await getTranslation(lang);

    res.status(200).json({
      success: true,
      translations
    });
  } catch (err) {
    next(err);
  }
});

LanguageRoutes.post("/update", async (req, res, next) => {
  try {
    let { lang, translation } = req.body;

    let updated = await updateKeysValueAPI({
      lang,
      translation
    });

    if (updated) {
      
      updateKeyValueLogger(req.username, {
        lang,
        key: updated.key
      });

      res.status(200).json({
        success: true,
        message: "Value updated"
      });
    } else {
      throw 'Value was not updated'
    }
  } catch (err) {
    next(err);
  }
});

LanguageRoutes.post("/delete", (req, res, next) => {
  try {
    let { data } = req.body;

    let deleted = deleteKeyAPI(data);

    if (deleted) {
      deleteKeyLogger(req.username, data);

      res.status(200).json({
        success: true,
        message: "Deleted"
      });
    } else {
      throw 'Unable to delete';
    }
  } catch (err) {
    next(err);
  }
});

LanguageRoutes.get("/activities/last", (req, res, next) => {
  try {
    let lastActivity = getLastActivity() || [];

    res.status(200).json({
      success: true,
      activity: lastActivity
    });
  } catch (err) {
    next(err);
  }
});

LanguageRoutes.get("/activities/all", (req, res, next) => {
  try {
    let activites = getActivities() || [];

    res.status(200).json({
      success: true,
      activites
    });
  } catch (err) {
    next(err);
  }
});

LanguageRoutes.get('/getLangs', async (req, res, next) => {
  try {
    let languages = await getLanguages();

    res.status(200).json({
      success: true,
      languages
    });
  } catch(err) {
    next(err);
  }
})

export default LanguageRoutes;
