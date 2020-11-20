const express = require("express");
const googleTrends = require("google-trends-api");

const router = express.Router();

const loopTopics = async (topicsArray, location) => {
  var myJson = {};
  for (const item of topicsArray) {
    const value = await findTrend(item, location);
    myJson[item.toString()] = value;
  }
  return myJson;
};

const findTrend = async (keyword, location) => {
  // let csvContent = "";
  let final = 0;
  let value = 0;
  await googleTrends
    .interestOverTime({
      keyword,
      geo: location,
      startTime: new Date(2015, 1, 1),
    })
    .then(function (results) {
      var receivedData = results.toString();
      receivedData = JSON.parse(receivedData);
      var i;
      for (i = 0; i < receivedData.default.timelineData.length; i++) {
        var time = receivedData.default.timelineData[i].formattedAxisTime;
        var v = receivedData.default.timelineData[i].value;
        //to remove comma in time
        var cleanedTime = time.replace(",", "");
        final += parseInt(v);
        value = final / receivedData.default.timelineData.length;
        // csvContent += cleanedTime + "," + v + "\r\n";
      }
      // console.log(csvContent);
    })
    .catch(function (err) {
      console.error("Oh no there was an error", err);
    });
  return value;
};

router.post("/nepal", async (req, res) => {
  try {
    var reqBody = req.body.topics;
    var topicsArray = reqBody.split(",");
    var response = await loopTopics(topicsArray, "NP");
    res.send(response);
  } catch (error) {
    console.log(error);
  }
});

router.post("/world", async (req, res) => {
  try {
    var reqBody = req.body.topics;
    var topicsArray = reqBody.split(",");
    var response = await loopTopics(topicsArray, "");
    res.send(response);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
