import React, {Component} from 'react';
import PropTypes from 'prop-types';

import queryString from 'query-string';

import DeckListing from './DeckListing.js';
import ListingContainer from './ListingContainer.js';
import DeckFilters from './DeckFilters.js';

import './PageStyling.css';

const deckAPIURL = '/API/search/decks';
const filtersAPIURL = '/API/get/filters';
const deckCountAPIURL = '/API/get/deckCount';

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
	//DeckName
	//Houses (array represented as a comma separated string eg:"dis,untamed") (list of *selected* houses)
class DeckPage extends Component {
	constructor(props) {
		super(props);
		this.state = {results:props.results, maxPageNumber:1, totalItems:0};
		this.updateDecks = this.updateDecks.bind(this);
	}
	componentDidMount() {
		this.updateDecks();
	}
	componentWillReceiveProps(props) {
		this.updateDecks(props);
	}
	updateDecks(props=this.props) {
		const queryInfo = queryString.parse(props.location.search);
		var deckURL = deckAPIURL + props.location.search;
		if(Object.keys(queryInfo).length === 0) {
			deckURL += "?";
		}
		if(queryInfo.PageNumber === undefined) {
			deckURL += "PageNumber=" + props.pageNumber + "&";
		}
		if(queryInfo.PageCount === undefined) {
			deckURL += "PageCount=" + props.pageCount + "&";
		}
		//var deckURL = "/API/get/decks" + this.props.location.search;
		console.log("fetching decks");
		fetch(deckURL).then(res => res.json())
			.then((decks) => 
				{
					const deckCount = decks.totalCount;
					var maxPage = Math.floor(deckCount/props.pageCount);
					if(deckCount%props.pageCount !== 0) {maxPage += 1;}
					console.log(decks);
					this.setState({results:decks.deckList, maxPageNumber:maxPage, totalItems:deckCount});
				}
			);
	}
	render() {
		var queryInfo = queryString.parse(this.props.location.search);
		queryInfo = Object.assign({}, {PageCount:this.props.pageCount, PageNumber:this.props.pageNumber}, queryInfo);
		return(
			<div id="deckPage" className="page">
				<div className="sideBar">
					<DeckFilters qData={queryInfo} qBase={this.props.qBase}/>
				</div>
				<div className="mainContent">
					<ListingContainer itemsData={this.state.results} itemPrototype={DeckListing} qData={queryInfo} qBase={this.props.qBase} maxPageNumber={this.state.maxPageNumber} totalItems={this.state.totalItems}/>
				</div>
			</div>
		);
	}
}
DeckPage.propTypes = {
	results: PropTypes.array,
	pageCount: PropTypes.number,
	pageNumber: PropTypes.number,
	deckName: PropTypes.string,
	qBase: PropTypes.string.isRequired
}
DeckPage.defaultProps = {
	results: [],
	pageCount: 20,
	pageNumber: 1,
	deckName: ""
}

export default DeckPage;