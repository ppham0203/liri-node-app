var request = require("request");
var keys = require("./keys.js");
var spotify = require("node-spotify-api");
var twitter = require("twitter");
var twitKeys = keys.twitterKeys;
var spotifyKey = keys.spotifyKeys;
var command = process.argv[2];

// SPOTIFY COMMAND!
if (command === 'spotify-this-song') {
  var spotifypass = new spotify(spotifyKey);

  var songName = "";
  var track = process.argv;
  // Capture all the words in the address (again ignoring the first two Node arguments)
  for (var i = 3; i < track.length; i++) {

    songName = songName + " " + track[i];
    songName = songName.trim();
    spotifypass.search({
      type: 'track',
      query: songName
    }, function(err, data) {

      if (err) {
        return console.log('Error occurred: ' + err);
      }
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song Title: " + data.tracks.items[0].name);
      console.log("Preview URL: " + data.tracks.items[0].external_urls.spotify);
      console.log("Album Name: " + data.tracks.items[0].album.name);
    });
  }
}

// TWITTER COMMAND!
if (process.argv[2] === "my-tweets") {

  var client = new twitter(twitKeys);

  var params = {
    screen_name: 'wordofpaytor',
    count: 20
  };
  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {

      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].text);
        console.log(tweets[i].created_at);

      }
    }
  });
}

// OMBD COMMAND!
var nodeArgs = process.argv;
var fs = require("fs");
// Create an empty string for holding the address
if (command == "moviethis") {
  var userInput = "";
  var userInputTrim = "Mr+Nobody";
  // Capture all the words in the address (again ignoring the first two Node arguments)
  for (var i = 3; i < nodeArgs.length; i++) {

    userInput = userInput + " " + nodeArgs[i];
    userInputTrim = userInput.trim();
  }


  // We then run the request module on a URL with a JSON
  request("http://www.omdbapi.com/?t=" + userInputTrim + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
    var ratings = JSON.parse(body).Ratings;
    // If there were no errors and the response code was 200 (i.e. the request was successful)...
    if (!error && response.statusCode === 200) {


      // Then we print out the movie info
      console.log("Title " + JSON.parse(body).Title);
      console.log("Year released " + JSON.parse(body).Year);
      console.log("IMDB Rating " + JSON.parse(body).imdbRating);

      // console.log("Rotten Tomatoes Rating " + JSON.parse(body).Ratings["Rotten Tomatoes"].Value);
      for (i = 0; i < ratings.length; i++) {
        if (ratings[i].Source === "Rotten Tomatoes") {
          console.log("Rotten Tomatoe Rating: " + JSON.parse(body).Ratings[i].Value);
        }
      }
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);

    }
  });
}


// do what it says
if (command == "do-what-it-says") {

  fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    // We will then print the contents of data
    console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
    var spotifypass = new spotify(spotifyKey);
    spotifypass.search({
      type: 'track',
      query: dataArr[1]
    }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }

      console.log("Artist:" + data.tracks.items[0].artists[0].name + "\nSong Name:" + data.tracks.items[0].name + "\nPreview Link:" + data.tracks.items[0].external_urls.spotify + "\nAlbum Name:" + data.tracks.items[0].album.name);

    });

  });

}
