import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom'

import formatQuery from './UtilityFunctions.js';
import ListingPageIndex from './ListingPageIndex.js';

import './SortContainerStyle.css';

//class for storing and displaying cards, decks, etc
//displays a sortable *list* of items
//props:
	//itemsData: the data for the items to be stored / displayed
	//sortKeys: an array of *strings* that reference a property of the items to sort by (eg: "Name", "House", etc)
	//itemPrototype: a prototype component that is used to render the data contained in the itemsData object
	//maxPageNumber: the total number of page results
	//pageNumber: only used if pageNumber isn't included in qData!
	//qData: parsed info from the query string for the current page (eg: searchDecks or seachCards)
	//qBase: the base URL for redirecting after updating searches (eg: "/API/search/decks")
//state:
	//itemsData: the data for the items to be stored / displayed
	//sortKey: the active sort key
	//ascendingSort: whether items are sorted ascendingly or not

//from query string (DECKS)
	//PageNumber
	//PageCount
	// -- ignore the rest, not used here --
	//DeckName
	//Houses (array represented as a comma separated string eg:"dis,untamed") (list of *selected* houses)
class ListingContainer extends Component {
	constructor(props) {
		super(props);
		const defaultSort = props.sortKeys.length > 0 ? props.sortKeys[0] : undefined;
		var sortKey = props.qData.Sort === undefined ? defaultSort : props.qData.Sort;
		const ascending = props.qData.Ascending === "false" ? false : true;
		this.state = {itemsData:props.itemsData, sortKey:sortKey, ascendingSort:ascending, redirect:false};
		this.getSortButtons = this.getSortButtons.bind(this);
		this.setSortKey = this.setSortKey.bind(this);
	}
	componentWillReceiveProps(props) {
		const defaultSort = props.sortKeys.length > 0 ? props.sortKeys[0] : undefined;
		var sortKey = props.qData.Sort === undefined ? defaultSort : props.qData.Sort;
		const ascending = props.qData.Ascending === "false" ? false : true;
		this.setState({itemsData:props.itemsData, sortKey:sortKey, ascending:ascending, redirect:false});
	}
	//listener function for the sort buttons that sorts the items accordingly when fired
	setSortKey(e) {
		var sortMethod = e.target.value;
		this.setState((prevState, props) => {
			//if user clicks a currently selected sort option, toggle the ascending / descending order and reverse the item array
			if(prevState.sortKey === sortMethod) {
				return({ascendingSort:!prevState.ascendingSort, redirect:true});
			}
			//if user clicks a currently unselected sort option, sort the results
			return({sortKey:sortMethod, ascendingSort:true, redirect:true});
		});
	}
	//returns a set of buttons the user can use to sort the items with
	getSortButtons() {
		const activeSortStyle = {color:"white"};
		const arrow = this.state.ascendingSort ? <i class="fas fa-arrow-up"></i> : <i class="fas fa-arrow-down"></i>;

		var buttons = this.props.sortKeys.map((option) => {
			return(
				<span>
					<input type="radio" name="sort" id={option} value={option} checked={option === this.state.sortKey} onClick={this.setSortKey}/>
					<label for={option} style={option === this.state.sortKey ? activeSortStyle : null}>{option}{this.state.sortKey === option ? arrow : null}</label>
				</span>);
		});
		return(
			<form className="optionsContainer sortOptions">
				{buttons}
			</form>
		);

	}
	render() {
		if(this.state.redirect) {
			const queryData = Object.assign({}, this.props.qData, {Sort:this.state.sortKey, Ascending:this.state.ascendingSort});
			return (<Redirect to={this.props.qBase + formatQuery(queryData)} />);
		}
		var currentPage = 1;
		if(this.props.qData.PageNumber !== undefined) {
			currentPage = parseInt(this.props.qData.PageNumber);
		}
		var resultRangeStart = (this.props.qData.PageCount) * (currentPage - 1) + 1;
		var resultRangeEnd = resultRangeStart + this.state.itemsData.length - 1;
		var totalResults = this.props.totalItems;
		resultRangeStart = totalResults === 0 ? 0 : resultRangeStart;
		return(
			<div className="listingContainer">
				<div className="resultsCount">
					<p>Results <b>{resultRangeStart + " - " + resultRangeEnd}</b> of <b>{totalResults}</b></p>
				</div>
				{
					//if items can be sorted, add a sorting bar, otherwise add nothing
					this.props.sortKeys.length > 0 ? 
						<div className="listingOptions">{this.getSortButtons()}</div> :
						null
				}
				<div className="items">
					{
						//renders a set of items using the prototype component stored in props
						this.state.itemsData.map((itemData) => {return(
							<this.props.itemPrototype data={itemData} />);
						})
					}
				</div>
				{	
					this.props.maxPageNumber > 1 ? 
						<ListingPageIndex end={this.props.maxPageNumber} current={currentPage} qData={this.props.qData} qBase={this.props.qBase}/>
						: undefined
				}
			</div>
		);
	}
}
//itemsData: the data for the items to be stored / displayed
//sortKeys: an array of *strings* that reference a property of the items to sort by (eg: "Name", "House", etc)
//itemPrototype: a prototype component that is used to render the data contained in the itemsData object
ListingContainer.propTypes = {
	itemsData: PropTypes.array,
	pageNumber: PropTypes.number,
	maxPageNumber: PropTypes.number.isRequired,
	totalItems: PropTypes.number.isRequired,
	itemPrototype: PropTypes.func,
	qData: PropTypes.object,
	qBase: PropTypes.string.isRequired

}
ListingContainer.defaultProps = {
	itemsData: [],
	sortKeys: [],
	sortKey: undefined,
	pageNumber: 1
}

export default ListingContainer;