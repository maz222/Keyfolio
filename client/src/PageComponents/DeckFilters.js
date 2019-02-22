import React, {Component} from 'react';

import CollapseFilter from './CollapseFilter.js';

import './SearchFilterStyle.css';

//props
	//houses : array of house names (strings)
	//setDecks: a callback function to update the deck listings

//state
	//houses: array of *valid* houses (all houses by default)

class DeckFilters extends Component {
	constructor(props) {
		super(props);
		this.state = {houses:props.houses};
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
			data['Name'] = data['Name'][0];
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
		const url = '/API/searchDecks' + jsonToQueryString(parsedData);
		console.log(url);
		fetch(url)
			.then(res => res.json())
			.then(decks => { 
				console.log(decks);
				this.props.setDecks(decks.decks);
			});
	}
	render() {
		return (
			<form className="searchFilters" onSubmit={this.search}>
				<div className="searchContainer">
					<input type="text" placeholder="Deck Name" name="Name"/>
					<button type="submit"><i class="fas fa-search"></i></button>
				</div>
				<CollapseFilter title={"Houses"} options={this.props.houses} selected={this.state.houses}/>
			</form>
		);
	}
}
DeckFilters.defaultProps = {
	houses: []
}

export default DeckFilters;