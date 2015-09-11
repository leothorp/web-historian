var archive = require('../helpers/archive-helpers');
var CronJob = require('cron').CronJob;

new CronJob('0 * * * * *', function() {
  console.log('cronJobbin!');
  archive.readListOfUrls(archive.downloadUrls);
}, null, true, "America/Los_Angeles");

