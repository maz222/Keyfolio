import React, {Component} from 'react';

import './DeckListingStyle.css';

class DeckListing extends Component {
	constructor(props) {
		super(props);
		this.state = {displayDetails: false, cards:this.reduceCards(props.data.cards)};
		this.toggleDetails = this.toggleDetails.bind(this);
	}
	reduceCards(cards) {
		var cardDict = {}
		for(var c in cards) {
			if(cards[c].card_title in cardDict) {
				cardDict[cards[c].card_title] += 1;
			}
			else {
				cardDict[cards[c].card_title] = 1;
			}
		}
		return cardDict;
	}
	toggleDetails() {
		console.log(this.state.cards);
		this.setState((prevState) => {
			return({displayDetails: !prevState.displayDetails});
		});
	}
	render() {
		return(
			<div className="deckListing">
				<div className="deckOverview" onClick={this.toggleDetails}>
					<h1 className="deckName">{this.props.data.name}</h1>
					<h1 className="deckHouses">{this.props.data.houses.join(", ")}</h1>
				</div>
				{this.state.displayDetails ? 
					<div className="deckDetails">
						{Object.keys(this.state.cards).map((card) => {
							return(
								<div className="card">
									<p className="cardName">{card}</p>
									{this.state.cards[card] > 1 ? <p className="cardQuantity">{this.state.cards[card]}</p> : null}
								</div>
							);
						})}
					</div>
					:
					null
				}
			</div>
		);
	}
}
DeckListing.defaultProps = {
	data: {
		name: "Default Deck",
		houses: ["N/A","N/A","N/A"],
		cards: [{name:"Default Card",type:"N/A",house:"N/A",rarity:"N/A"}]
	}
}
export default DeckListing;
