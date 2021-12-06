import React from "react"
import SelectSearch, { fuzzySearch } from 'react-select-search'

import { TreeDBGetValidNewDependencies } from "../model/Tree_M.js"

export default class Search extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			options: [{"name":"EMPTY", "value":"EMPTY"}],
			search_term: ''
		}
	}

	componentDidMount() {
		this.updateChoices()
	}



	updateChoices() {
		this.props.g.V().hasLabel("imperative").project("value", "name")
			.by(__.id())
			.by(__.values("title"))
			.toList()
		.then(IDT => {
			const obm = IDT.map(x => Object.fromEntries(x))
			this.setState({options: obm})
			console.log("Search has state", obm)
		})
	}

	filterOptionsOrNew(options) {
		const fuzzy_search = fuzzySearch(options)


		// console.log("FOoN Options: ", options.map(x => x))
		return (value) => {
			if (this.state.search_term != value && value.length){
				console.log("Search Setting search term ", value)
				this.setState({search_term: value})
			}
			const fsearch_result = fuzzy_search(value).filter(result => result["value"] !== "NEW_CHILD")


			if (!fsearch_result.length || fsearch_result[0]["value"] !== "NEW_CHILD"){
				fsearch_result.push({"value": "NEW_CHILD", "name":"<Create a vert named '" + value + "'>"})
			}
			
			return fsearch_result

			// console.log("FSearch: ", fsearch_result)


			// if (!fsearch_result.length) {
			// 	return [{"value": "NEW_CHILD", "name":"<Create a vert named '" + value + "'>"}]
			// } else {
			// 	return fsearch_result
			// }
		};
	}

	injectSearchTerm(id){
		console.log("Injecting Search Term ", this.state.search_term, " to ID ", id)
		this.setState({search_term: ''})
		return this.props.onChange(id, this.state.search_term)
	}



	render() {
		
		return (
			<SelectSearch 
				options={this.state.options}
				name="Vertex" 
				placeholder="Pick a Vertex" 
				search
				filterOptions={this.filterOptionsOrNew.bind(this)}
				// filterOptions={fuzzySearch}
				// autoComplete={"on"}
				autoFocus={false}
				onChange={this.injectSearchTerm.bind(this)}
			/>
		)
	}
}