const AWS = require('aws-sdk');

let keys = {};

module.exports = async function getSecretValue(secretName, key) {
  console.log(`Retrieving secret from name ${secretName} with key ${key}`);

  // if (keys[secretName] && keys[secretName][key] && ) {
  //   return keys[secretName][key];
  // }
  let secret = await new AWS.SecretsManager().getSecretValue({ SecretId: secretName }).promise();

  if (secret.SecretString) {
    let secretObj = JSON.parse(secret.SecretString);
    /* eslint require-atomic-updates: 0 */
    keys[secretName] = JSON.parse(secret.SecretString);
    return secretObj ? secretObj[key] : undefined;
  }
  return undefined;
};
