import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';

import formatQuery from './UtilityFunctions.js';

import './ListingPageIndexStyle.css';

//Component that keeps track of how many pages of results there are for a search, and allows the user to navigate through them
//EG: the page count at the bottom of a google search
//props:
	//start: the starting (min) page number (defaults to 1)
		//1 INDEXED
	//end: the ending (max) page number
		//1 INDEXED
	//current: the current page number
		//1 INDEXED
	//visPages: how many pages are visible in the nav at a time (defaults to 10)
		//EG: 1 2 3 4 5 6 7 8 9 10 
	//offset: how many pages are to the left of the current page #
		//used to keep the current page in the center of the bar when possible
			//EG: 6 7 8 9 10 *11* 12 13 14 15
	//qData: parsed info from the URL query string
	//qBase: the base URL for redirecting after updating searches (eg: "/API/search/cards")

//from query string 
	//PageNumber
	//PageCount
	//DeckName
	//Houses (array represented as a comma separated string eg:"dis,untamed") (list of *selected* houses)

class ListingPageIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {currentPage: parseInt(this.props.current)};
		this.getPageNumbers = this.getPageNumbers.bind(this);
		this.getPageNumberElements = this.getPageNumberElements.bind(this);
		this.incrementPage = this.incrementPage.bind(this);
		this.decrementPage = this.decrementPage.bind(this);
		this.setPage = this.setPage.bind(this);
	}
	componentWillReceiveProps(props) {
		this.setState({currentPage: parseInt(props.current)});
	}
	getPageNumbers() {
		var pageNumbers = [];
		//add the page numbers to the left of the current page
			//EG: -1- -2- *3* 4 5 6 7 8 9 10
		const numLeftPages = Math.min(this.props.offset, this.props.current - this.props.start); 
		for(var i = 0; i < numLeftPages; i++) {
			pageNumbers.push(this.props.current - numLeftPages + i);
		}
		pageNumbers.push(this.props.current);
		//add the page numbers to the right of the current page
			//EG: 1 2 *3* -4- -5- -6- -7- -8- -9- -10-
		const numRightPages = Math.min(this.props.visPages - numLeftPages, this.props.end - this.state.currentPage + 1);
		for(var i = 1; i < numRightPages; i++) {
			pageNumbers.push(parseInt(this.state.currentPage) + i);
		}
		return pageNumbers;
	}
	incrementPage() {
		this.setState((prevState) => {
			return({currentPage: Math.min(prevState.currentPage + 1, this.props.end)});
		})
	}
	decrementPage() {
		this.setState((prevState) => {
			return({currentPage: Math.max(prevState.currentPage - 1, this.props.start)});
		})
	}
	setPage(number) {
		this.setState({currentPage: number});
	}
	getPageNumberElements() {
		const numbers = this.getPageNumbers();
		return numbers.map((number) => {
			const styleClasses = (number === this.props.current ? "pageNumber activePage" : "pageNumber");
			return(
				<h4 className={styleClasses} onClick={() => {this.setPage(number)}}>{number}</h4>
			);
		});
	}
	render() {
		if(this.props.start == 0) {
			return (null);
		}
		if(this.state.currentPage !== this.props.current) {
			const queryData = Object.assign({}, this.props.qData, {PageNumber:this.state.currentPage});
			return (<Redirect to={this.props.qBase+formatQuery(queryData)} />);
		}
		const leftIcon = <i class="fas fa-chevron-left" onClick={this.decrementPage}></i>;
		const rightIcon = <i class="fas fa-chevron-right" onClick={this.incrementPage}></i>;
		return(
			<div className="pageIndex">
				{this.props.current > this.props.start ? leftIcon : null}
				{this.getPageNumberElements()}
				{this.props.current < this.props.end ? rightIcon : null}
			</div>
		);
	}
}
ListingPageIndex.defaultProps = {
	start: 1,
	current: 1,
	visPages: 10,
	offset: 5
}
ListingPageIndex.propTypes = {
	start: PropTypes.number,
	end: PropTypes.number.isRequired,
	current: PropTypes.number,
	visPages: PropTypes.number,
	offset: PropTypes.number,
	qData: PropTypes.object,
	qBase: PropTypes.string.isRequired
}

export default ListingPageIndex;