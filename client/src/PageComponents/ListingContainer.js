import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './SortContainerStyle.css';

//class for storing and displaying cards, decks, etc
//displays a sortable *list* of items
//props:
	//itemsData: the data for the items to be stored / displayed
	//sortKeys: an array of *strings* that reference a property of the items to sort by (eg: "Name", "House", etc)
	//itemPrototype: a prototype component that is used to render the data contained in the itemsData object
//state:
	//itemsData: the data for the items to be stored / displayed
	//sortKey: the active sort key
	//ascendingSort: whether items are sorted ascendingly or not
class ListingContainer extends Component {
	constructor(props) {
		super(props);
		var defaultSort = props.sortKeys.length > 0 ? props.sortKeys[0] : null;
		var sortedItems = defaultSort == null ? props.itemsData : this.sortItems(props.itemsData, defaultSort);
		this.state = {itemsData:sortedItems, sortKey:defaultSort, ascendingSort:true};

		this.getSortButtons = this.getSortButtons.bind(this);
		this.setSortKey = this.setSortKey.bind(this);
	}
	componentWillReceiveProps(props) {
		this.setState((prevState) => {
			if(prevState.sortKey === null || prevState.sortKey === undefined) {
				if(props.sortKeys != undefined) {
					return({itemsData:this.sortItems(props.itemsData, props.sortKeys[0]), sortKey:props.sortKeys[0]});
				}
				return({itemsData:props.itemsData});
			}
			return({itemsData:this.sortItems(props.itemsData, prevState.sortKey)});
		})
	}
	//creates and returns a sorted copy of a given set of item data
	sortItems(itemsData, sortKey) {
		var itemsCopy = itemsData.slice();
		itemsCopy.sort((a,b) => {
			if(a[sortKey] < b[sortKey]) 
				return -1;
			else if(a[sortKey] === b[sortKey]) 
				return 0;
			else 
				return 1;
		});
		return itemsCopy;
	}
	//listener function for the sort buttons that sorts the items accordingly when fired
	setSortKey(e) {
		var sortMethod = e.target.value;
		this.setState((prevState, props) => {
			//if user clicks a currently selected sort option, toggle the ascending / descending order and reverse the item array
			if(prevState.sortKey == sortMethod) {
				var items = prevState.itemsData.slice();
				items.reverse();
				return({itemsData:items, ascendingSort:!prevState.ascendingSort});
			}
			//if user clicks a currently unselected sort option, sort the results
			var newItems = this.sortItems(prevState.itemsData, sortMethod.toLowerCase());
			return({itemsData:newItems, sortKey:sortMethod, ascendingSort:true});
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
		return(
			<div className="listingContainer">
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
			</div>
		);
	}
}
//itemsData: the data for the items to be stored / displayed
//sortKeys: an array of *strings* that reference a property of the items to sort by (eg: "Name", "House", etc)
//itemPrototype: a prototype component that is used to render the data contained in the itemsData object
ListingContainer.propTypes = {
	itemsData: PropTypes.array,
	sortKeys: PropTypes.array,
	itemPrototype: PropTypes.func

}
ListingContainer.defaultProps = {
	itemsData: [],
	sortKeys: [],
}

export default ListingContainer;