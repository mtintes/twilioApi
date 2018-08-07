var dotenv = require('dotenv');
var cfg = {};

dotenv.config({path: '.env'});

cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN;
cfg.sendingNumber = process.env.TWILIO_NUMBER;
cfg.admin = process.env.Admin;
cfg.booth = process.env.BoothApi;
cfg.profile = process.env.ProfileApi;

var requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber, cfg.admin];
var isConfigured = requiredConfig.every(function(configValue) {
  return configValue || false;
});

if (!isConfigured) {
  var errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';

  throw new Error(errorMessage);
}

module.exports = cfg;
