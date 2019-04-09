require("dotenv").config();

var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

//first argument should be the category
var category = process.argv[2];
var search = process.argv.slice(3).join(" ");

//in case of search
switch (category) {

    case ("spotify"):
        {
            searchSpotify();
        }
        break;

    case ("band"):
        {
            searchBand();
        }
        break;

    case ("movie"):
        {
            searchMovie();
        }
        break;

    default:
        {
            console.log("Please type the category you want to search (spotify, band, movie)");
        }
}

//functions ----------------------

function searchSpotify() {

    //spotify call
    spotify.search({
        type: 'track',
        query: search,
        limit: 1
    }, function (err, data) {
        if (err) {
            // return console.log('Error occurred: ' + err);
            return console.log('Error occurred: please make search you spelled it correctly!!!!!');
        }

        // Artist(s)
        var spotArtist = data.tracks.items[0].artists[0].name;
        // The song's name
        var spotMusicName = data.tracks.items[0].name;
        // A preview link of the song from Spotify
        var spotMusicName = data.tracks.items[0].preview_url;
        // The album that the song is from
        var spotAlbum = data.tracks.items[0].album.name;
        console.log("The artist is " + spotArtist + " and the song's name is "+ spotMusicName + " from the album " + spotAlbum);
    });
}

function searchBand() {

    var bandSearch = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp"
    axios.get(bandSearch).then((response) => {
        var artist = response.data[0];
        // Name of the venue
        var venueName = artist.venue.name;
        // Venue location
        var venueLocation = artist.venue.country + "," + artist.venue.city;
        // Date of the Event(use moment to format this as "MM/DD/YYYY")
        var venueEvent = artist.datetime;

        console.log(search + " is playing at " + venueName + " in " + venueLocation + " on " + moment(venueEvent).format("L"));
    });
}

function searchMovie() {
    var omdbSearch = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";

    axios.get(omdbSearch).then((response) => {

        console.log("Title: " + response.data.Title);
        console.log("Year: " + response.data.Year);
        console.log("IMBD Rating: " + response.data.imdbRating);
        console.log(response.data.Ratings[1].Source + ", " + response.data.Ratings[1].Value)
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);

    });
}