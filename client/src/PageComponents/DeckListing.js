import React, {Component} from 'react';

import './DeckListingStyle.css';

class DeckListing extends Component {
	constructor(props) {
		super(props);
		this.state = {displayDetails: false};
		this.toggleDetails = this.toggleDetails.bind(this);
		console.log(props);
	}
	toggleDetails() {
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
						{this.props.data.cards.map((card) => {
							return(
								<div className="card">
									<p className="cardName">{card.card_title}</p>
									<p className="cardType">{card.card_type}</p> 
									<p className="cardHouse">{card.house}</p>
									<p className="cardRarity">{card.rarity}</p>
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
