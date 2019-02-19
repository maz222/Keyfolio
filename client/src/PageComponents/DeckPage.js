import React, {Component} from 'react';
import DeckListing from './DeckListing.js';
import ListingContainer from './ListingContainer.js';

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
		//fetch('/API/glossary?category=houses')
		//	.then(res => res.json())
		//	.then((houses) => {
		//		console.log(houses);
		//		this.setState({houses:houses.terms});
		//	});
	}
	setDecks(decks) {
		console.log(decks);
		this.setState({results:decks.slice(0,10)});
	}
	render() {
		return(
			<div id="deckPage" className="page">
				<div className="sideBar">
				</div>
				<div className="mainContent">
					<ListingContainer itemsData={this.state.results} sortKeys={["Name","Houses"]} itemPrototype={DeckListing} />
				</div>
			</div>
		);
	}
}
DeckPage.defaultProps = {
	results: [],
	houses: []
}

export default DeckPage;