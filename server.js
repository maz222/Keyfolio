const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

const dbManager = require('database-manager');
const USER = "maz2";
const PASS = "keysmith1";
const manager = new dbManager(USER, PASS);

// -------------------------

//dataWrapper - {decks:[], cards:{}, deckCount, glossary:[]}
function addToDB(dataWrapper) {
	//add cards
	const CARDS = Object.values(dataWrapper.cards);
	for(var c in CARDS) {
		manager.addCard(CARDS[c]);
	}
	//console.log(`Adding ${dataWrapper.decks.length} decks`);
	//add decks
	//for(var d in dataWrapper.decks) {
	//	var tempDeck = dataWrapper.decks[d];
	//	manager.addDeck(tempDeck);
	//}
	manager.addGlossary(dataWrapper.glossary);
}

function addPage(page, pageSize=10) {
	addToDB(parser.getDeckData(page, pageSize));	
}

function addPageRange(start, end, pageSize=10) {
	console.log("adding pages");
	console.log([start,end, pageSize]);
	for(var page = start; page <= end; page++) {
		var dataPromise = parser.getDeckData(page, pageSize);
		dataPromise.then((data) => {
			console.log("cards: " + Object.values(data.cards).length);
			console.log("decks: " + data.decks.length);
			addToDB(data);
		});
	}
}

const DECKS_PER_PAGE = 25;

// ------------------------

//update given a range
app.get('/updateDBRange', function(req, res, next) {
	const START = parseInt(req.query.startPage);
	const END = parseInt(req.query.endPage);
	const PAGE_SIZE = DECKS_PER_PAGE;
	addPageRange(START, END, PAGE_SIZE);
	res.render('index', {title:'Express'});
});

app.get('/API/cards', function(req, res, next) {
	manager.getCards().then((cards) => {
		res.send({cardList:cards});
	});
});

app.get('/glossary', function(req,res,next) {
	var category = req.query.category;
	category = category.substring(1,category.length-1);
	manager.getGlossaryByCategory(category).then((terms) => {
		console.log(terms);
		res.send({terms:terms});
	});
});

app.get('/searchCards', function(req,res,next) {
	console.log(req.query);
	var title = req.query.Title;
	var houses = req.query.Houses == undefined ? [] : req.query.Houses.split(',');
	var types = req.query.Types == undefined ? [] : req.query.Types.split(',');
	var rarities = req.query.Rarities == undefined ? [] : req.query.Rarities.split(',');
	const cardResults = manager.searchCards({title:title,houses:houses,types:types,rarities:rarities});
	cardResults.then((cards) => {
		res.send({cards:cards});
	});
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