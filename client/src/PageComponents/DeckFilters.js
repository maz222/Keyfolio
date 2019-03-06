import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom'

import formatQuery from './UtilityFunctions.js';

import CollapseFilter from './CollapseFilter.js';

import './SearchFilterStyle.css';

//props
	//qData: parsed info from the URL query string {name:"",houses:""}

//state
	//houseList: array of *valid* houses (all houses by default)

//from query string 
	//PageNumber
	//PageCount
	//DeckName
	//Houses (array represented as a comma separated string eg:"dis,untamed") (list of *selected* houses)

const filtersAPIURL = '/searchFilters';

class DeckFilters extends Component {
	constructor(props) {
		super(props);
		this.state = {houseList:props.houses, parsedData:undefined};
		this.search = this.search.bind(this);
	}
	componentDidMount() {
		fetch(filtersAPIURL)
			.then(res => res.json())
			.then((filters) => {
				this.setState({houseList:filters.houses});
			});		
	}
	componentWillReceiveProps(props) {
		this.setState({houseList:props.houses, parsedData:undefined});
		fetch(filtersAPIURL)
			.then(res => res.json())
			.then((filters) => {
				this.setState({houseList:filters.houses});
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
		this.setState({parsedData: parsedData});
	}
	render() {
		if(this.state.parsedData !== undefined) {
			const queryData = Object.assign({}, this.props.qData, this.state.parsedData);
			return (<Redirect to={this.props.qBase + formatQuery(queryData)} />);
		}
		const selectedHouses = this.props.qData.Houses !== undefined ? this.props.qData.Houses.split(',') : [];
		return (
			<form className="searchFilters" onSubmit={this.search}>
				<div className="searchContainer">
					<input type="text" placeholder="Deck Name" name="Name" value={this.props.qData.DeckName}/>
					<button type="submit"><i className="fas fa-search"></i></button>
				</div>
				<CollapseFilter title={"Houses"} options={this.state.houseList} selected={selectedHouses}/>
			</form>
		);
	}
}
DeckFilters.propTypes = {
	qData: PropTypes.object.isRequired,
	qBase: PropTypes.string.isRequired
}
DeckFilters.defaultProps = {
	houses: []
}

export default DeckFilters;