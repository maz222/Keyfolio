const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

const dbManager = require('database-manager');
const USER = "maz2";
const PASS = "keysmith1";
const manager = new dbManager(USER, PASS);


//API Endpoint
	//Returns the number of cards in the database
app.get('/API/get/cardCount', function(req, res, next) {
	manager.getCardCount().then((count) => {
		res.send({cardCount:count});
	});
});

//API Enpoint
	//Returns the number of decks in the database
app.get('/API/get/deckCount', function(req, res, next) {
	manager.getDeckCount().then((count) => {
		res.send({deckCount:count});
	});
});

//how many cards are listed in a single results page
const cardPageSize = 20;

//API Endpoint
	//Returns a list of *all* the cards stored in the database
	//*Input* : OPTIONAL
	// --- Page Info --- 
		//PageCount : an int representing how many cards are listed on a page
		//PageNumber: an int representing the desired page number
		//SortKey: a string representing how the cards are to be sorted
		//SortAscending: a bool representing whether the cards are sorted in ascending order or not
app.get('/API/get/cards', function(req, res, next) {
	manager.getCards(req.query).then((cards) => {
		res.send({cardList:cards});
	});
});

//how many decks are listed in a single results page
const deckPageSize = 20;

//API Endpoint
	//Returns a list of *all* the decks stored in the database
	//*Input* : OPTIONAL
		// --- Page Info --- 
			//PageCount : an int representing how many cards are listed on a page
			//PageNumber: an int representing the desired page number
			//SortKey: a string representing how the cards are to be sorted
			//SortAscending: a bool representing whether the cards are sorted in ascending order or not
app.get('/API/get/decks', function(req, res, next) {
	manager.getDecks(req.query).then((decks) => {
		res.send({deckList:decks});
	});
});

//API Endpoint
	//Returns a list of game terms based on a given category
	//*Input* : one of ["houses","traits","types","rarities"]
app.get('/API/get/glossary', function(req,res,next) {
	var category = req.query.category;
	//category = category.substring(1,category.length-1);
	console.log(category);
	manager.getGlossaryByCategory(category).then((terms) => {
		console.log(terms);
		res.send({terms:terms});
	});
});

//API Endpoint
	//Searches the database for a set of parameters and returns a matching list of cards
	//*Input* : any of
		/// --- Card Info ---
			//Title   : a string representing the title of the card (or a portion of it)
			//Houses  : an array of strings representing house names
			//Rarities: an array of strings representing card rarities
			//Types   : an array of strings representing card types
			//If any of the above inputs are not defined (not passed), search assumes any of the possible values (from the glossary) are valid
		// --- Page Info --- 
			//PageCount : an int representing how many cards are listed on a page
			//PageNumber: an int representing the desired page number
			//Sort: a string representing how the cards are to be sorted
			//Ascending: a bool representing whether the cards are sorted in ascending order or not
app.get('/API/search/cards', function(req,res,next) {
	console.log(req.query);
	req.query.Title = req.query.Title === undefined ? "" : req.query.Title;
	req.query.Houses = req.query.Houses === undefined ? [] : req.query.Houses.split(',');
	req.query.Types = req.query.Types === undefined ? [] : req.query.Types.split(',');
	req.query.Rarities = req.query.Rarities === undefined ? [] : req.query.Rarities.split(',');
	req.query.Sort = req.query.Sort === undefined ? "" : req.query.Sort;
	req.query.Ascending = (req.query.Ascending === undefined || req.query.Ascending === "false") ? -1 : 1; 
	const cardResults = manager.searchCards(req.query);
	const resultCount = manager.getCardSearchCount(req.query);
	Promise.all([cardResults, resultCount]).then((results) => {
		res.send({cardList:results[0], totalCount: results[1]});
	})
});

app.get('/API/search/decks', function(req,res,next) {
	console.log(req.query);
	req.query.Name = req.query.Name === undefined ? "" : req.query.Name;
	req.query.Houses = req.query.Houses === undefined ? [] : req.query.Houses.split(',');
	const deckResults = manager.searchDecks(req.query);
	const resultCount = manager.getDeckSearchCount(req.query);
	Promise.all([deckResults, resultCount]).then((results) => {
		res.send({deckList: results[0], totalCount: results[1]});
	})
});

app.get('/searchFilters', function(req,res,next) {
	const categories = ["houses","types","rarities"];
	var pArray = [];
	for(var c in categories) {
		pArray.push(manager.getGlossaryByCategory(categories[c]));
	}
	Promise.all(pArray).then((results) => {
		var tempResponse = {};
		for(var c in categories) {
			var tempTerms = [];
			for(var t in results[c]) {
				tempTerms.push(results[c][t].term);
			}
			tempResponse[categories[c]] = tempTerms;
		}
		res.send(tempResponse);
	});
});

app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', function (req, res) {
	//console.log(path.join(__dirname,'client', 'build', 'index.html'));
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(process.env.PORT || 5000);