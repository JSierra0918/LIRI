require("dotenv").config();
//global variables
var fs = require("fs");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var lineDivide = "\n--------------------------------------------------------\n";
var logTime = `${moment().format("L'LLLL")}\n`;
//first argument should be the category
var category = process.argv[2];
var search = process.argv.slice(3).join(" ");

//in case of search
switch (category) {
    case ("spotify"):
        {
            searchSpotify(search);
        }
        break;

    case ("band"):
        {
            searchBand(search);
        }
        break;

    case ("movie"):
        {
            searchMovie(search);
        }
        break;

    case ("read"): {
        readTxt();
    } break;

    default:
        {
            console.log("Please type the category you want to search (spotify, band, movie, fs)");
        }
}

// SECTION functions ----------------------=====================================

function searchSpotify(search) {

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
        var spotPreviewName = data.tracks.items[0].preview_url;
        // The album that the song is from
        var spotAlbum = data.tracks.items[0].album.name;
        var logData = `${lineDivide}${logTime}The artist is " + ${spotArtist} + "\nand the song's name is " + ${spotMusicName} + "\nfrom the album " + ${spotAlbum} + "\n Here's a preview link: " + ${spotPreviewName}${lineDivide}`;
        console.log(logData);
        //log data to log txt
        log(logData)
    });
}

function searchBand(search) {
    var bandSearch = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp"
    axios.get(bandSearch).then((response) => {
        var artist = response.data[0];
        // Name of the venue
        var venueName = artist.venue.name;
        // Venue location
        var venueLocation = artist.venue.city + ", " + artist.venue.region + ", " + artist.venue.country;
        // Date of the Event(use moment to format this as "MM/DD/YYYY")
        var venueEvent = artist.datetime;

        var logData = `${lineDivide}${logTime}${search} is playing at ${venueName} \nin ${venueLocation} \non ${moment(venueEvent).format("L")}${lineDivide}`;
        console.log(logData);
        log(logData);
    });
}

function searchMovie(search) {
    var omdbSearch = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";

    axios.get(omdbSearch).then((response) => {

        var movieData = response.data;
        var logData ="";

        for (var key in movieData) {
            
            if (key === "Title"){
                logData += `${key}: ${movieData[key]}\n`;
            }
            if (key === "Year"){
                logData += `${key}: ${movieData[key]}\n`;
            }
            if (key === "imdbRating"){
                logData += `IMDB Rating: ${movieData[key]}\n`;
            }
            if (key === "Ratings"){

                for (const key2 in movieData[key]) {
                    const movieDataKey2 =movieData[key][key2]
                    if (movieDataKey2.Source === "Rotten Tomatoes") {
                        logData += `${movieDataKey2.Source}: ${movieDataKey2.Value}\n`;
                    }
                }
            }
            if (key === "Country"){
                logData += `${key}: ${movieData[key]}\n`;
            }
            if (key === "Language"){
                logData += `${key}: ${movieData[key]}\n`;
            }
            if (key === "Plot"){
                logData += `${key}: ${movieData[key]}\n`;
            }
            if (key === "Actors"){
                logData += `${key}: ${movieData[key]}\n`;
            }
        }
        console.log(`${lineDivide}${logTime}${logData}${lineDivide}`);
        log(`${lineDivide}${logTime}${logData}${lineDivide}`);
    });
}

function readTxt() {
    fs.readFile("./random.txt", "utf8", (error, data) => {
        if (error) {
            console.log("There was an error!");
        }
        var fileData = data.split(",");
        
        //tried to make this function initiate the command node liri.js read
        // category = fileData[0];
        // search = fileData[1];

        searchSpotify(fileData[1]);
    });
}

function log(data) {
    fs.appendFile("log.txt", data, (err) => {
        if (err) { console.log(err); }
    })
}