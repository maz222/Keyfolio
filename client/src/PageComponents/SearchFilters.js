import React, {Component} from 'react';

import CollapseFilter from './CollapseFilter.js';

import './SearchFilterStyle.css';

//props
	//houses : array of house names (strings)
	//types: array of card types (strings)
	//rarities: array of card rarities (strings)
	//setCards: a callback function to update the card listings

//state
	//houses: array of *valid* houses (all houses by default)
	//types: array of *valid* types (all types by default)
	//rarities: array of *valid* rarities (all rarities by default)
	//mavericks: bool representing whether maverick cards are valid or not (true by default)

class SearchFilters extends Component {
	constructor(props) {
		super(props);
		this.state = {houses:props.houses, types:props.types, rarities:props.rarities, mavericks:true};
		this.search = this.search.bind(this);
	}
	search(e){
		function parseForm(formData) {
			var data = {};
			for(var p of formData.entries()) {
				if(p[0] in data) {
					data[p[0]].push(p[1]);
				}
				else {
					data[p[0]] = [p[1]];
				}
			}
			data['Title'] = data['Title'][0];
			return data;
		}
		function jsonToQueryString(json) {
	    	return '?' + 
	        Object.keys(json).map(function(key) {
	            return encodeURIComponent(key) + '=' +
	                encodeURIComponent(json[key]);
	        }).join('&');
		}
		e.preventDefault();
		const data = new FormData(e.target);
		const parsedData = parseForm(data);
		const url = '/API/searchCards' + jsonToQueryString(parsedData);
		console.log(url);
		fetch(url)
			.then(res => res.json())
			.then(cards => { 
				console.log(cards);
				this.props.setCards(cards.cards);
			});
	}
	render() {
		return (
			<form className="searchFilters" onSubmit={this.search}>
				<div className="searchContainer">
					<input type="text" placeholder="Card Title" name="Title"/>
					<button type="submit"><i class="fas fa-search"></i></button>
				</div>
				<CollapseFilter title={"Houses"} options={this.props.houses} selected={this.state.houses}/>
				<CollapseFilter title={"Types"} options={this.props.types} selected={this.state.types}/>
				<CollapseFilter title={"Rarities"} options={this.props.rarities} selected={this.state.rarities}/>
			</form>
		);
	}
}
SearchFilters.defaultProps = {
	houses: [],
	types: [],
	rarities: [],
	mavericks: true
}

export default SearchFilters;