import React, {Component} from 'react';

import SearchFilters from './SearchFilters.js';

import CardListingsContainer from './CardListingsContainer.js';

import './PageStyling.css';

class SearchPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			results:this.props.cards,
			houses: this.props.houses,
			rarities: this.props.rarities,
			types: this.props.types
		};
		this.setCards = this.setCards.bind(this);
	}
	componentDidMount() {
		console.log("fetching cards");
		fetch('/API/cards')
			.then(res => res.json())
			.then((cards) => {
				this.setState({results:cards.cardList});
				});
		fetch('/searchFilters')
			.then(res => res.json())
			.then(filters => {
				this.setState({houses:filters.houses, rarities:filters.rarities, types:filters.types});
			});
	}
	setCards(cards) {
		this.setState({results:cards});
	}
	render() {
		return(
			<div id="searchPage" className="page">
				<div className="sideBar">
					<SearchFilters setCards={this.setCards} houses={this.state.houses} rarities={this.state.rarities} types={this.state.types}/>
				</div>
				<div className="mainContent">
					<CardListingsContainer itemsData={this.state.results} />
				</div>
			</div>
		);
	}
}
SearchPage.defaultProps = {
	cards:[],
	houses:[],
	rarities:[],
	types:[]
}

export default SearchPage;