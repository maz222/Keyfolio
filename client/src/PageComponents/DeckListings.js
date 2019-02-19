import React, {Component} from 'react';

import DeckListing from './DeckListing.js';

class DeckListings extends Component {
	constructor(props) {
		super(props);
		this.state = {decks:this.sortByKey(props.decks,props.sortType), sortType:props.sortType};
		this.getSortButtons = this.getSortButtons.bind(this);
	}
	componentWillReceiveProps(props) {
		var decks = props.deck;
		this.setState((prevState) => {
			return {cards:this.sortByKey(decks,prevState.sortType)}
		});
	}
	sortByKey(decks, deckKey) {
		var decksCopy = decks.slice();
		decksCopy.sort((a,b) => {
			if(a[deckKey] < b[deckKey]) 
				return -1;
			else if(a[deckKey] == b[deckKey]) 
				return 0;
			else 
				return 1;
		});
		return decksCopy;
	}
	getSortButtons() {
		var options = ["Name","Houses"];
		return(options.map((option) => {
			return(
				<span>
					<input type="radio" name="sort" id={option} value={option} checked={option == this.state.sort} onChange={this.setSorting}/>
					<label for={option}>{option}</label>
				</span>
			);
		}));
	}
	render() {
		return(
			<div id="deckListings">
				<form className="sortContainer">
					
				</form>
				<div id="decks">
					{
						this.state.decks.map((deck) => {
							return(
								<DeckListing name={deck.Name} houses={dec.Houses} cards={deck.Cards} />
							);
						});
					}
				</div>
			</div>
		);
	}
}
DeckListings.defaultProps = {
	decks: [{
		Name: "Default Deck",
		Houses: ["N/A","N/A","N/A"],
		Cards: [{name:"Default Card",type:"N/A",house:"N/A",rarity:"N/A"}
	}],
	sortType: "Name"
}
export default DeckListings;