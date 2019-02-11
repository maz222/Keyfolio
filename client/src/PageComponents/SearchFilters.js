import React, {Component} from 'react';
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
		const url = '/searchCards' + jsonToQueryString(parsedData);
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
			<form id="searchFilters" onSubmit={this.search}>
				<div id="searchContainer">
					<input type="text" value={this.state.title} onChange={this.updateTitle} placeholder="Card Title" name="Title"/>
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

//props
	//title: the title/category of the filter ("house","type",etc)
	//options: the options the user can select from
//state
	//selected: a *set* of all currently selected options
	//colapsed: whether the options are collapsed (visible) or not

class CollapseFilter extends Component {
	constructor(props) {
		super(props);
		var buttonStatuses = {};
		for(var i in props.options) {
			buttonStatuses[props.options[i]] = true;
		}
		this.state = {collapsed:false, selected:buttonStatuses};
		this.getOptions = this.getOptions.bind(this);
		this.toggleFilter = this.toggleFilter.bind(this);
		this.selectAll = this.selectAll.bind(this);
		this.toggleDropdown = this.toggleDropdown.bind(this);
	}
	selectAll() {
		//iterate through all the options, and keep track of ones which aren't selected
		var toSelect = [];
		for(var i in this.props.options) {
			var option = this.props.options[i];
			if(!this.state.selected[option]) {
				toSelect.push(option);
			}
		}
		console.log(toSelect);
		//if there are options to select, select all of them
		if(toSelect.length > 0) {
			this.setState((prevState,props) => {
				for(var i in toSelect) {
					prevState.selected[toSelect[i]] = true;
				}
				return({selected:prevState.selected});
			});
		}
		//if all the options are already selected, unselect them
		else {
			this.setState({selected:{}});
		}

	}
	toggleDropdown() {
		this.setState((prevState, props) => {
			return {collapsed:!prevState.collapsed};
		});
	}
	toggleFilter(e) {
		console.log(e.target.value);
		var val = e.target.value;
		this.setState((prevState,props) => {
			prevState.selected[val] = !prevState.selected[val];
			return({selected:prevState.selected});
		});
	}
	getOptions() {
		var t = this;
		return this.props.options.map(function(option) {
			return(
				<span>
					<input type="checkbox" className="filterOption" id={option} value={option} name={t.props.title} 
						checked={t.state.selected[option]} onClick={t.toggleFilter} />
					<label for={option}>{option}</label>
				</span>
			);
		});
	}
	render() {
		var filterClass = this.state.collapsed ? "filterButtons collapsed" : "filterButtons";
		var caret = this.state.collapsed ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-up"></i>;
		return (
			<div className="dropFilter">
				<button type="button" className="dropButton" onClick={this.toggleDropdown}>{this.props.title}{caret}</button>
				<div className={filterClass}>
					<button type="button" className="selectAllButton" onClick={this.selectAll}>Select All</button>
					{this.getOptions()}
				</div>
			</div>
		);
	}
}

export default SearchFilters;