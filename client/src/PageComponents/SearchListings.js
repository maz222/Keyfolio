import React, {Component} from 'react';

import {ListCard, GridCard} from './CardListing.js';

import './SearchListingsStyle.css';

const listStyle = {
	display: "flex",
	flexDirection: "column"
};

const gridStyle = {
	display: "flex",
	flexWrap: "wrap"
};

const emptyStyle = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center"
};
class SearchListings extends Component {
	//props
		//cards - array of card data objects
	//state
		//display - the current display method ("Grid","List")
		//sort - the current sorting method ("Name","Type","House","Rarity")
		//cards - array of card data objects
	constructor(props) {
		super(props);
		this.getListings = this.getListings.bind(this);
		this.state = {display:"List", sort:"Name", cards:props.cards};
		this.getSortButtons = this.getSortButtons.bind(this);
		this.setGridDisplay = this.setGridDisplay.bind(this);
		this.setSorting = this.setSorting.bind(this);
	}
	componentWillReceiveProps(props) {
		var cards = props.cards;
		this.setState((prevState) => {
			return {cards:this.sortListings(cards,prevState.sort)}});
	}
	getListings() {
		if(this.state.cards.length === 0) {
			return(<h1>No Results</h1>);	
		}
		switch(this.state.display) {
			case "Grid": 
				return this.state.cards.map((card) => <GridCard data={card} />);
			case "List":
				return this.state.cards.map((card) => <ListCard data={card} />);
		}
	}
	getSortButtons() {
		var options = ["Name","House","Type","Rarity"];
		return(options.map((option) => {
			return(
				<span>
					<input type="radio" name="sort" id={option} value={option} checked={option == this.state.sort} onChange={this.setSorting}/>
					<label for={option}>{option}</label>
				</span>
			);
		}));

	}
	setGridDisplay(e) {
		//this.setState({isGrid: b});
		this.setState({display: e.target.value});
	}
	setSorting(e) {
		var sortMethod = e.target.value;
		this.setState((prevState, props) => {
			var newCards = this.sortListings(prevState.cards, sortMethod);
			return({cards:newCards, sort:sortMethod});
		});
	}
	//returns a sorted *copy* of a array of cards
	sortListings(cards, sort) {
		function sortByKey(cards, cardKey) {
			var cardsCopy = cards.slice();
			cardsCopy.sort((a,b) => {
				if(a[cardKey] < b[cardKey]) 
					return -1;
				else if(a[cardKey] == b[cardKey]) 
					return 0;
				else 
					return 1;
			});
			return cardsCopy;
		}
		if(cards === undefined || cards.length == 0) {
			return [];
		}
		switch(sort) {
			case "Name":
				return(sortByKey(cards,"card_title"));
			case "Type":
				return(sortByKey(cards,"card_type"));
			case "House":
				return(sortByKey(cards,"house"));
			case "Rarity":
				const rarities = {"Common":0,"Uncommon":1,"Rare":2,"Special":3};
				var cardsCopy = cards.slice();
				cardsCopy.sort((a,b) => {
					const aRarity = a.rarity in rarities ? rarities[a.rarity] : Number.MAX_VALUE;
					const bRarity = b.rarity in rarities ? rarities[b.rarity] : Number.MAX_VALUE;
					return aRarity - bRarity; 
				});
				return cardsCopy;
			default:
				return cards;
		}
	}
	render() {
		var styling = null;
		switch(this.state.display) {
			case "List":
				styling = listStyle;
				break;
			case "Grid":
				styling = gridStyle;
				break;
		}
		if(this.state.cards.length == 0) {
			styling = emptyStyle;
		}
		return(
			<div id="searchListings">
				<div id="listingOptions">
					<form id="sortContainer">
						{this.getSortButtons()}
					</form>
					<form id="displayContainer">
						<input type="radio" id="gridInput" name="display" value="Grid" checked={this.state.display == "Grid"} onChange={this.setGridDisplay}/>
						<label for="gridInput"><i className="fas fa-th"></i></label>
						<input type="radio" id="listInput" name="display" value="List" checked={this.state.display == "List"} onChange={this.setGridDisplay}/>
						<label for="listInput"><i className="fas fa-list"></i></label>
					</form>
				</div>
				<div id="listings" style={styling}>
					{this.getListings()}
				</div>
			</div>
		);
	}
}

export default SearchListings;