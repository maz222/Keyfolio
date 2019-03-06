import React from 'react';
import {Redirect} from 'react-router-dom'

import formatQuery from './UtilityFunctions.js';

import ListingContainer from './ListingContainer.js';
import ListingPageIndex from './ListingPageIndex.js';
import {ListCard, GridCard} from './CardListing.js';

const listStyle = {
	display: "flex",
	flexDirection: "column"
};

const gridStyle = {
	display: "flex",
	flexWrap: "wrap",
	flexDirection: "row"
};

const emptyStyle = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center"
};
// --- Listing Container ---
//class for storing and displaying cards, decks, etc
//displays a sortable *list* of items
//props:
	//itemsData: the data for the items to be stored / displayed
	//sortKeys: an array of *strings* that reference a property of the items to sort by (eg: "Name", "House", etc)
	//itemPrototype: a prototype component that is used to render the data contained in the itemsData object
//state:
	//itemsData: the data for the items to be stored / displayed

// -- Card Listings Container --
//extends Listing Container and adds different display modes specific to cards (grid vs list)
//props:
	//listPrototype: a prototype component for rendering cards in list view
	//gridPrototype: a prototype component for rendering cards in grid view
//state:
	//display: which display mode the listings are in ("List" or "Grid")

class CardListingsContainer extends ListingContainer {
	constructor(props) {
		super(props);
		this.setGridDisplay = this.setGridDisplay.bind(this);
		this.getDisplayButtons = this.getDisplayButtons.bind(this);
		this.state.display = "List";
		this.state.itemsData = props.itemsData;
	}
	setGridDisplay(e) {
		this.setState({display: e.target.value});
	}
	getDisplayButtons() {
		return(
			<form className="optionsContainer displayOptions">
					<input type="radio" id="gridInput" name="display" value="Grid" checked={this.state.display === "Grid"} onChange={this.setGridDisplay}/>
					<label for="gridInput"><i className="fas fa-th"></i></label>
					<input type="radio" id="listInput" name="display" value="List" checked={this.state.display === "List"} onChange={this.setGridDisplay}/>
					<label for="listInput"><i className="fas fa-list"></i></label>
				</form>
		)
	}
	render() {
		if(this.state.redirect) {
			const queryData = Object.assign({}, this.props.qData, {Sort:this.state.sortKey, Ascending:this.state.ascendingSort});
			return (<Redirect to={this.props.qBase + formatQuery(queryData)} />);
		}
		console.log(this.state);
		var styling = null;
		switch(this.state.display) {
			case "List":
				styling = listStyle;
				break;
			case "Grid":
				styling = gridStyle;
				break;
			default:
				styling = emptyStyle;
				break;
		}
		var currentPage = 1;
		if(this.props.qData.PageNumber !== undefined) {
			currentPage = this.props.qData.PageNumber;
		}
		var resultRangeStart = (this.props.qData.PageCount) * (currentPage - 1) + 1;
		var resultRangeEnd = resultRangeStart + this.state.itemsData.length - 1;
		var totalResults = this.props.totalItems;
		resultRangeStart = totalResults === 0 ? 0 : resultRangeStart;
		return(
			<div className="listingContainer cardsContainer">
				<div className="listingOptions">
					{this.getSortButtons()}
					{this.getDisplayButtons()}
				</div>
				<div className="resultsCount">
					<p>Results <b>{resultRangeStart + " - " + resultRangeEnd}</b> of <b>{totalResults}</b></p>
				</div>
				<div className="items" id="listings" style={styling}>
				{
					this.state.itemsData.map((itemData) => {
						switch(this.state.display) {
							case "List":
								return <this.props.listPrototype data={itemData} />
							case "Grid":
								return <this.props.gridPrototype data={itemData} />
							default: 
								return <this.props.listPrototype data={itemData} />
						}
					})
				}
				</div>
				{
					this.props.maxPageNumber > 1 ? 
						<ListingPageIndex end={this.props.maxPageNumber} current={currentPage} qData={this.props.qData} qBase={this.props.qBase}/>
						: undefined
				}
			</div>
		)
	}
}
CardListingsContainer.defaultProps = {
	sortKeys: ["Name","House","Type"],
	listPrototype: ListCard,
	gridPrototype: GridCard
}

export default CardListingsContainer;