import React, {Component} from 'react';
import PropTypes from 'prop-types';

import queryString from 'query-string';

import SearchFilters from './SearchFilters.js';
import CardListingsContainer from './CardListingsContainer.js';

import './PageStyling.css';

const cardAPIURL = '/API/search/cards';
const deckAPIURL = '/API/search/decks';

//Props *default values only to be used when nothing is passed via query string*
	//pageNumber: 1
	//pageCount: 20
	//results: []
	//qBase: the base URL for redirecting after updating searches (eg: "/API/search/cards")

//State
	//results: list of decks pulled from the api
	//maxPageNumber: the number of result pages

//from query string 
	//PageNumber
	//PageCount
	//CardName
	//Houses (array represented as a comma separated string eg:"dis,untamed") (list of *selected* houses)
	//Rarities (array represented as a comma separated string eg:"rare,common") (list of *selected* rarities)
	//Types (array represented as a comma separated string eg:"action,creature") (list of *selected* types)

class SearchPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			results:props.results,
			maxPageNumber: 1,
			totalItems: 0
		};
		this.setCards = this.setCards.bind(this);
		this.updateCards = this.updateCards.bind(this);
	}
	componentDidMount() {
		console.log("fetching cards");
		this.updateCards();
	}
	componentWillReceiveProps(props) {
		this.updateCards();
	}
	updateCards(props=this.props) {
		const queryInfo = queryString.parse(props.location.search);
		var cardURL = cardAPIURL + props.location.search;
		if(Object.keys(queryInfo).length === 0) {
			cardURL += "?";
		}
		if(queryInfo.PageNumber === undefined) {
			cardURL += "PageNumber=" + props.pageNumber + "&";
		}
		if(queryInfo.PageCount === undefined) {
			cardURL += "PageCount=" + props.pageCount + "&";
		}
		//var deckURL = "/API/get/decks" + this.props.location.search;
		console.log("fetching decks");
		fetch(cardURL).then(res => res.json())
			.then((cards) => 
				{
					const cardCount = cards.totalCount;
					var maxPage = Math.floor(cardCount/props.pageCount);
					if(cardCount%props.pageCount !== 0) {maxPage += 1;}
					console.log(cards);
					this.setState({results:cards.cardList, maxPageNumber:maxPage, totalItems:cardCount});
				}
			);
	}
	setCards(cards) {
		this.setState({results:cards});
	}
	render() {
		var queryInfo = queryString.parse(this.props.location.search);
		queryInfo = Object.assign({}, {PageCount:this.props.pageCount, PageNumber:this.props.pageNumber}, queryInfo);
		return(
			<div id="searchPage" className="page">
				<div className="sideBar">
					<SearchFilters qData={queryInfo} qBase={this.props.qBase}/>
				</div>
				<div className="mainContent">
					<CardListingsContainer itemsData={this.state.results} qData={queryInfo} qBase={this.props.qBase} maxPageNumber={this.state.maxPageNumber} totalItems={this.state.totalItems}/>
				</div>
			</div>
		);
	}
}
SearchPage.propTypes = {
	results: PropTypes.array,
	pageCount: PropTypes.number,
	pageNumber: PropTypes.number,
	cardName: PropTypes.string,
	houses: PropTypes.array,
	rarities: PropTypes.array,
	types: PropTypes.array,
	qBase: PropTypes.string.isRequired
}
SearchPage.defaultProps = {
	results:[],
	pageCount: 21,
	pageNumber: 1,
	cardName: "",
	houses: [],
	rarities: [],
	types: []
}

export default SearchPage;