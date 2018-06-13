/*
  Reddit API interaction script for Meemz
  <> with <3 by /u/DeeBo (overflo.me)
  https://github.com/Adybo123
*/
const request = require('request');
const redditAPI = request.defaults({
    headers: {'User-Agent': 'node:me.overflo.meemz:v0.1'}
})
const path = require('path');
const fs = require('fs');
const MeemzCore = require("./MeemzCore.js");
var baseURL = "https://api.reddit.com/r/memes/best";

var lastImage = MeemzCore.Settings['lastRequest'];

function apiRequest (requestURL) {
  redditAPI.get(requestURL, function (error, response, body) {
    if (response.statusCode==200) {
      MeemzCore.apiDataIn(body);
    } else {
      console.log("REDDIT API ERROR.")
      console.log(response)
      alert("Reddit API request failed!\nCan't deliver you spicy memes if your internet is down.\nOr maybe it's the Reddit API.")
    }
  });
}

exports.getOriginalMeme = function () {
  var requestURL = "";
  if (lastImage!=undefined || lastImage!="") {
    requestURL = baseURL + "?after=" + lastImage;
  } else {
    requestURL = baseURL;
  }
  apiRequest(requestURL);
}
