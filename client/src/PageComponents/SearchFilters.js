import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom'

import formatQuery from './UtilityFunctions.js';

import CollapseFilter from './CollapseFilter.js';

import './SearchFilterStyle.css';

//props
	//qData: parsed info from the URL query string {name:"",houses:""}
	//qBase: the base URL for redirecting after updating searches (eg: "/API/search/cards")

//state
	//houses: array of *valid* houses (all houses by default)
	//types: array of *valid* types (all types by default)
	//rarities: array of *valid* rarities (all rarities by default)
	//mavericks: bool representing whether maverick cards are valid or not (true by default)

//from query string 
	//PageNumber
	//PageCount
	//CardName
	//Houses (array represented as a comma separated string eg:"dis,untamed") (list of *selected* houses)
	//Types
	//Rarities
	//Mavericks

const filtersAPIURL = '/searchFilters';


class SearchFilters extends Component {
	constructor(props) {
		super(props);
		this.state = {houses:props.houses, types:props.types, rarities:props.rarities, mavericks:true, parsedData:undefined};
		this.search = this.search.bind(this);
	}
	componentDidMount() {
		fetch(filtersAPIURL)
			.then(res => res.json())
			.then((filters) => {
				this.setState({houses:filters.houses, types:filters.types, rarities:filters.rarities});
			});
	}
	componentWillReceiveProps(props) {
		this.setState({houses:props.houses, types:props.types, rarities:props.rarities, parsedData:undefined});
		fetch(filtersAPIURL)
			.then(res => res.json())
			.then((filters) => {
				this.setState({houses:filters.houses, types:filters.types, rarities:filters.rarities});
			});
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
		this.setState({parsedData: parsedData});
	}
	render() {
		if(this.state.parsedData !== undefined) {
			const queryData = Object.assign({}, this.props.qData, this.state.parsedData);
			return(<Redirect to={this.props.qBase + formatQuery(queryData)} />);
		}
		const selectedHouses = this.props.qData.Houses !== undefined ? this.props.qData.Houses.split(',') : [];
		const selectedTypes = this.props.qData.Types !== undefined ? this.props.qData.Types.split(',') : [];
		const selectedRarities = this.props.qData.Rarities !== undefined ? this.props.qData.Rarities.split(',') : [];
		return (
			<form className="searchFilters" onSubmit={this.search}>
				<div className="searchContainer">
					<input type="text" placeholder="Card Title" name="Title"/>
					<button type="submit"><i className="fas fa-search"></i></button>
				</div>
				<CollapseFilter title={"Houses"} options={this.state.houses} selected={selectedHouses}/>
				<CollapseFilter title={"Types"} options={this.state.types} selected={selectedTypes}/>
				<CollapseFilter title={"Rarities"} options={this.state.rarities} selected={selectedRarities}/>
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
SearchFilters.propTypes = {
	houses: PropTypes.array,
	types: PropTypes.array,
	rarities: PropTypes.array,
	mavericks: PropTypes.bool,
	qData: PropTypes.object.isRequired,
	qBase: PropTypes.string.isRequired
}

export default SearchFilters;