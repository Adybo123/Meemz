//Constants - Imports & Settings
const $ = require("jQuery");
const fs = require("fs");
const {clipboard} = require('electron')
const MeemzSettings = $.parseJSON(fs.readFileSync("./meemz.json", "UTF8"));
exports.Settings = MeemzSettings;
console.log(MeemzSettings)
var firstRequest = true;
var lastImgURL = "";
//Variables - Changed by functions
var APIResponse = "";


//Internal functions - called by exports
function initNewMeme() {
  if (firstRequest!=true) {
    $('#imgContainer').addClass("fadeOutRight");
    setTimeout(function () {
      $('#imgContainer').removeClass("fadeOutRight");
      $('#imgContainer').addClass("hidden");
      MeemzReddit.getOriginalMeme();
    },1000);
  } else {
    MeemzReddit.getOriginalMeme();
  }
}

function writeToSettings() {
  fs.writeFile('./meemz.json', JSON.stringify(MeemzSettings), function (err) {
    if (err) {
      throw err;
      alert("Error saving data.\nYou can continue to view memes, but on next restart, Meemz might show you the same ones again.");
    }
    console.log("File write attempt complete");
  });
}

function displayNewMeme() {
  var posts = APIResponse['data']['children'];
  for (var p = 0; p < posts.length; p++) {
    var postID = posts[p]['data']['name'];
    if (MeemzSettings['seen'].indexOf(postID)==-1) {
      //It's a fresh meme
      MeemzSettings['seen'].push(postID);
      MeemzSettings['lastRequest'] = postID;
      writeToSettings();
      var postImg = posts[p]['data']['preview']['images'][0]['source'];
      $('#memeTag').html("/u/" + String(posts[p]['data']['author']));
      $('#imgContainer').attr("style", "background-image: url(" + postImg['url'] + ");");
      lastImgURL = postImg['url'];
      $('#postTitle').html(" - " + String(posts[p]['data']['title']));
      if (firstRequest) {
        $('#modalFade').removeClass('hidden').addClass("fadeIn");
        $('#imgContainer').removeClass('hidden').addClass("fadeInDown");
        $('#infoModal').addClass('fadeOut');
        setTimeout(function () {
          $('#imgContainer').removeClass("fadeInDown");
          $('#infoModal').addClass('hidden');
        }, 1000);
        firstRequest = false;
      } else {
        $('#imgContainer').removeClass("hidden");
        $('#imgContainer').addClass("fadeInLeft");
        setTimeout(function () {
          $('#imgContainer').removeClass("fadeInLeft");
        },1000);
      }
      break;
    } else {
      if (p == posts.length - 1) {
        //Oh no! We reached the end of the request without getting anything!
        //Set the after arg and make another request for the next page
        MeemzSettings['lastRequest'] = postID;
        initNewMeme();
      }
    }
  }
}

//Exports - API endpoints, if you will.
exports.apiDataIn = function (resp) {
  APIResponse = $.parseJSON(resp);
  displayNewMeme();
}
exports.meemzInit = function () {
  $("#topContain").on("click", initNewMeme);
  $("#memeTag").contextmenu(function() {
    clipboard.writeText("https://reddit.com" + $("#memeTag").html());
    alert("User link copied to clipboard.");
  });
  $("#imgContainer").contextmenu(function() {
    clipboard.writeText(lastImgURL);
    alert("Image URL copied to clipboard.");
  });
}

const MeemzReddit = require("./MeemzReddit.js");
