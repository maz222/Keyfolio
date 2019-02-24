import React, {Component} from 'react';

import ListingContainer from './ListingContainer.js';
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
	}
	sortItems(itemsData, sortKey) {
		switch(sortKey) {
			case "name":
				return super.sortItems(itemsData,"card_title");
			case "type":
				return super.sortItems(itemsData,"card_type");
			case "rarity":
				const rarities = {"Common":0,"Uncommon":1,"Rare":2,"Special":3};
				var cardsCopy = itemsData.slice();
				cardsCopy.sort((a,b) => {
					const aRarity = a.rarity in rarities ? rarities[a.rarity] : Number.MAX_VALUE;
					const bRarity = b.rarity in rarities ? rarities[b.rarity] : Number.MAX_VALUE;
					return aRarity - bRarity; 
				});
				return cardsCopy;
			default:
				return super.sortItems(itemsData,sortKey);
		}
	}
	setGridDisplay(e) {
		this.setState({display: e.target.value});
	}
	getDisplayButtons() {
		return(
			<form className="optionsContainer displayOptions">
					<input type="radio" id="gridInput" name="display" value="Grid" checked={this.state.display == "Grid"} onChange={this.setGridDisplay}/>
					<label for="gridInput"><i className="fas fa-th"></i></label>
					<input type="radio" id="listInput" name="display" value="List" checked={this.state.display == "List"} onChange={this.setGridDisplay}/>
					<label for="listInput"><i className="fas fa-list"></i></label>
				</form>
		)
	}
	render() {
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
		if(this.state.itemsData.length == 0) {
			styling = emptyStyle;
		}
		return(
			<div className="listingContainer cardsContainer">
				<div className="listingOptions">
					{this.getSortButtons()}
					{this.getDisplayButtons()}
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
			</div>
		)
	}
}
CardListingsContainer.defaultProps = {
	sortKeys: ["Name","House","Type","Rarity"],
	listPrototype: ListCard,
	gridPrototype: GridCard
}

export default CardListingsContainer;