import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import logger from "./logger";
import curl from "curlrequest";
import { SECRET } from "../config";
import crypto from "crypto";
import cryptoJS from "crypto-js";
import FileDB from "./FileDB";
import { FILEDB } from "../config";
import StashAPI from "stash-api";

/**
 * Function to establish a connection with MongoDB on DB configuration
 * @method checkMongoConnection
 * @param url - MongoDB URL
 */
export const checkMongoConnection = async (url = "") => {
  return await new Promise((resolve, reject) => {
    try {
      MongoClient.connect(url, (err, db) => {
        if (err) {
          throw err;
        } else {
          logger.log(`Connection was established to: ${url}`);
          resolve(db);
        }
      });
    } catch (err) {
      logger.error(`Could not connect to mongoDB: ${err}`);
      reject(err);
    }
  });
};

/**
 * Function to authenticate a user over the configured SCM like git / bitbucket / stash
 * @method authenticateUserSCM
 * @param username - SCM username
 * @param password - SCM password
 */
export const authenticateUserSCM = (username, password) => {
  return new Promise(async (resolve, reject) => {
    const configInstance = new FileDB("config.json");
    const config = configInstance.getData();
    const instance = new FileDB("salt.json");
    const { salt } = instance.getData();

    if (config.scm === "GIT") {
      const { scmURL } = config;      
      const decryptedPassword = decryptPassword(password, salt);
      const response = await gitHubAuth(scmURL, username, decryptedPassword);

      if(response.error) {
        reject(response.err);
      } else {
        resolve(response);
      }
    } else if (config.scm === "BITBUCKET") {
      const { scmURL } = config;
      const decryptedPassword = decryptPassword(password, salt);
      const response = bitBucketAuth(scmURL, username, decryptedPassword);

      if (response.error) {        
        reject(response.err);
      } else {
        resolve(response);
      }
    } else if (config.scm === "BIT" || config.scm === "STASH") {
      const { scmURL } = config;
      const decryptedPassword = decryptPassword(password, salt);

      const response = stashAuth(scmURL, username, decryptedPassword);

      if(response.error) {
        reject(response.err);
      } else {
        resolve(response);
      }
    }
  });
};

/**
 * Stash authentication method
 * @param {*} scmURL 
 * @param {*} username 
 * @param {*} password 
 */
const stashAuth = (scmURL, username, password) => {
  return new Promise((resolve, reject) => {
    curl.request(
      {
        scmURL,
        user: `${username}:${password}`,
        headers: { "Content-Type": "application/json" }
      },
      (err, response) => {
        if (err) {
          logger.error(
            `Error in authenticating ${config.scm} account : ${err}`
          );
          reject({
            error: true,
            err
          });
        } else if (
          JSON.parse(response).message ||
          JSON.parse(response).message === "Bad credentials"
        ) {
          logger.error(`Error in authenticating : ${response}`);
          reject({
            error: true,
            err: response
          });
        } else {
          logger.log(`Authenticated ${config.scm} account`);
          resolve(response);
        }
      }
    );
  });
}

/**
 * Git hub authentication method
 * @param {*} username 
 * @param {*} password 
 */
const gitHubAuth = (scmURL, username, password) => {
  return new Promise((resolve, reject) => {
    curl.request(
      { url: scmURL, user: `${username}:${password}` },
      (err, response) => {
        if (err) {
          logger.error(`Error in authenticating: ${err}`);
          reject({
            error: true,
            err
          });
        } else if (
          JSON.parse(response).message ||
          JSON.parse(response).message === "Bad credentials"
        ) {
          logger.error(`Error in authenticating: ${response}`);
          reject({
            error: true,
            err: response
          });
        } else {
          logger.log("authenticated git account");
          getUser(username).then(response => {
            let { name, email, username } = response;
            resolve({
              token: signToken({
                name,
                username,
                email
              }),
              name
            });
          });
        }
      }
    );
  });
};

/**
 * Bit bucket authentication method
 * @param {*} scmURL 
 * @param {*} username 
 * @param {*} password 
 */
const bitBucketAuth = (scmURL, username, password) => {
  return new Promise((resolve, reject) => {
    curl.request({
      url: scmURL,
      user: `${username}:${password}`
    }, (err, response) => {
      if(err) {
        reject({
          error: true,
          err
        })
      } else if(JSON.parse(response).errors) {
        reject({
          error: true,
          err: {
            message: 'Authentication failed. Please check your credentials'
          }
        })
      } else {
        resolve({
          token: signToken({
            username
          }),
          username
        })
      }
    })
  });
};

/**
 * Function to generate a authentication salt.
 * @method generateSalt
 */
export const generateSalt = () => {
  try {
    let salt = crypto
      .createHash("md5")
      .update(SECRET)
      .digest("hex");
    let instance = new FileDB("salt.json");
    instance.writeData({ salt });
  } catch (err) {
    logger.error(`Something went wrong in generating salt: ${err}`);
    return err;
  }
};

/**
 * Function to read the generated salt from file db
 * @method readSalt
 */
export const readSalt = () => {
  try {
    let instance = new FileDB("salt.json");
    let { salt } = instance.getData();
    if (salt) {
      return salt;
    } else {
      let genSalt = crypto
        .createHash("md5")
        .update(SECRET)
        .digest("hex");
      instance.writeData({ salt: genSalt });
      salt = instance.getData().salt;
      return salt;
    }
  } catch (err) {
    logger.error(`Something went wrong while reading the salt: ${err}`);
    return err;
  }
};

/**
 * Function to encrypt the password, this is helper internally for test cases.
 * @method encryptPassword
 * @param password - user provided password
 * @param salt - backend generated salt
 */
export const encryptPassword = (password, salt) => {
  try {
    let cpassword = cryptoJS.AES.encrypt(password, salt);
    return cpassword;
  } catch (err) {
    logger.error(`Something went wrong in generating password crypt: ${err}`);
    return err;
  }
};

/**
 * Function to decrypt the password.
 * @method decryptPassword
 * @param passwordHash - Hashed password
 * @param salt - backend generated salt
 */
export const decryptPassword = (passwordHash, salt) => {
  try {
    let password = cryptoJS.AES.decrypt(passwordHash.toString(), salt);
    return password.toString(cryptoJS.enc.Utf8);
  } catch (err) {
    logger.error(`Error in decrypting the password: ${err}`);
    return err;
  }
};

export const signToken = payload => {
  try {
    let token = jwt.sign(payload, SECRET, { expiresIn: "3h" });
    return token;
  } catch (err) {
    logger.error(`Error in signing the token: ${err}`);
    return err;
  }
};

export const getUser = async user => {
  return await new Promise((resolve, reject) => {
    try {
      curl.request(
        {
          url: `https://api.github.com/users/${user}`
        },
        (err, response) => {
          if (err) {
            throw err;
          } else {
            let user = JSON.parse(response);
            resolve({
              email: user.email,
              username: user.login,
              name: user.name
            });
          }
        }
      );
    } catch (err) {
      logger.error(`Error in getting the user details ${err}`);
      return err;
    }
  });
};
