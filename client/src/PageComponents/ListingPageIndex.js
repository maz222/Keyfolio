import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './ListingPageIndexStyle.css';

//Component that keeps track of how many pages of results there are for a search, and allows the user to navigate through them
//EG: the page count at the bottom of a google search
//props:
	//start: the starting (min) page number (defaults to 1)
		//1 INDEXED
	//end: the ending (max) page number
		//1 INDEXED
	//length: how many pages are visible in the nav at a time (defaults to 10)
		//EG: 1 2 3 4 5 6 7 8 9 10 
	//offset: how many pages are to the left of the current page #
		//used to keep the current page in the center of the bar when possible
			//EG: 6 7 8 9 10 *11* 12 13 14 15
	//callback: the callback function that is called when a page is selected
		//don't store any page data here - just call a parent class' function to update the results given a page #
//state:
	//curentPage: the current page number
		//1 INDEXED

class ListingPageIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {currentPage: this.props.start};
		this.getPageNumbers = this.getPageNumbers.bind(this);
		this.getPageNumberElements = this.getPageNumberElements.bind(this);
		this.incrementPage = this.incrementPage.bind(this);
		this.decrementPage = this.decrementPage.bind(this);
	}
	getPageNumbers() {
		var pageNumbers = [];
		//add the page numbers to the left of the current page
			//EG: -1- -2- *3* 4 5 6 7 8 9 10
		const numLeftPages = Math.min(this.props.offset, this.state.currentPage - this.props.start); 
		for(var i = 0; i < numLeftPages; i++) {
			pageNumbers.push(this.state.currentPage - numLeftPages + i);
		}
		pageNumbers.push(this.state.currentPage);
		//add the page numbers to the right of the current page
			//EG: 1 2 *3* -4- -5- -6- -7- -8- -9- -10-
		const numRightPages = Math.min(this.props.length - numLeftPages, this.props.end - this.state.currentPage);
		for(var i = 1; i < numRightPages; i++) {
			pageNumbers.push(this.state.currentPage + i);
		}
		return pageNumbers;
	}
	incrementPage() {
		this.setState((prevState) => {
			return({currentPage: Math.min(prevState.currentPage + 1, this.props.end)});
		});
	}
	decrementPage() {
		this.setState((prevState) => {
			return({currentPage: Math.max(prevState.currentPage - 1, this.props.start)});
		})
	}
	getPageNumberElements() {
		const numbers = this.getPageNumbers();
		return numbers.map((number) => {
			const styleClasses = (number === this.state.currentPage ? "pageNumber activePage" : "pageNumber");
			return(
				<h4 className={styleClasses} onClick={() => {this.setState({currentPage:number})}}>{number}</h4>
			);
		});
	}
	render() {
		const leftIcon = <i class="fas fa-chevron-left" onClick={this.decrementPage}></i>;
		const rightIcon = <i class="fas fa-chevron-right" onClick={this.incrementPage}></i>;
		return(
			<div className="pageIndex">
				{this.state.currentPage > this.props.start ? leftIcon : null}
				{this.getPageNumberElements()}
				{this.state.currentPage < this.props.end ? rightIcon : null}
			</div>
		);
	}
}
ListingPageIndex.defaultProps = {
	start: 1,
	length: 10,
	offset: 5
}
ListingPageIndex.propTypes = {
	start: PropTypes.number,
	end: PropTypes.number.isRequired,
	length: PropTypes.number,
	offset: PropTypes.number,
	callback: PropTypes.func.isRequired
}

export default ListingPageIndex;