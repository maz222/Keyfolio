import React, {Component} from 'react';
import DeckListing from './DeckListing.js';
import ListingContainer from './ListingContainer.js';
import DeckFilters from './DeckFilters.js';

import './PageStyling.css';

class DeckPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			results: this.props.cards,
			houses: this.props.cards
		}
		this.setDecks = this.setDecks.bind(this);
	}
	componentDidMount() {
		console.log("fetching decks");
		fetch('/API/decks')
			.then(res => res.json())
			.then((decks) => {
				this.setDecks(decks.deckList);
			});
		fetch('/searchFilters')
			.then(res => res.json())
			.then((filters) => {
				this.setState({houses:filters.houses});
			});
	}
	setDecks(decks) {
		console.log("decks: " + decks);
		this.setState({results:decks.slice(0,10)});
	}
	render() {
		return(
			<div id="deckPage" className="page">
				<div className="sideBar">
					<DeckFilters setDecks={this.setDecks} houses={this.state.houses} />
				</div>
				<div className="mainContent">
					<ListingContainer itemsData={this.state.results} itemPrototype={DeckListing} />
				</div>
			</div>
		);
	}
}
DeckPage.defaultProps = {
	results: [],
	houses: ["Dis"]
}

export default DeckPage;