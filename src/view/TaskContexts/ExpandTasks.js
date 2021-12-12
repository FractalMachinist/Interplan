import { useState, useEffect } from 'react'
import SelectSearch, { fuzzySearch } from 'react-select-search'

import { TreeDBGetValidNewDependencies, TreeDBListenerFactory } from "../../model/Tree_M.js"
import { PropsDBVertAssign, PropsDBVertSingleLookup_Latest } from "../../model/Props_M.js"
import { RelDBAddChild } from "../../model/Rel_M.js"


export default function ExpandTasks({id}){
	const [options, setOptions] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [selection, setSelection] = useState("INVALID_ID")


	function grabOptions() {
		if (typeof id !== 'string'){
			return;
		}
		TreeDBGetValidNewDependencies(id, "Task").then(async (valid_deps) => { // Grab all valid potential dependencies
			// console.log(`${id} ExpandTasks grabOptions getting all valid dependencies`, valid_deps)
			return Promise.all(valid_deps.map(async (valid_dep) => { // Over each valid potential dependency
				// console.debug(`${id} ExpandTasks grabOptions getting info of dependency`, valid_dep)
				return {"name":(await PropsDBVertSingleLookup_Latest(valid_dep, "Title")), "value":valid_dep} // Construct an object with their name and value for searching
			}))
		}).then(setOptions) // Write the array of name/value objects into the Options array
	}

	useEffect(grabOptions, [id])

	const TDB_Listener = TreeDBListenerFactory(id, grabOptions)

	useEffect(TDB_Listener, [TDB_Listener, id]) // Re-do this whenever we're rebuilding this entire React object, which ought to happen if the id changes


	function filterOptionsOrNew(options) {
		const fuzzy_search = fuzzySearch(options)


		// console.log("FOoN Options: ", options.map(x => x))
		return (value) => {
			if (searchTerm !== value){
				console.log("Search Setting search term ", value)
				setSearchTerm(value)
			}
			const fsearch_result = fuzzy_search(value).filter(result => result["value"] !== "NEW_CHILD")



			fsearch_result.unshift({"value": "NEW_CHILD", "name":"<Create a vert named '" + value + "'>", "disabled":(searchTerm.length === 0)})

			
			return fsearch_result

		};
	}

	async function onSelect(selected_id){
		console.debug("onSelect w/ id", selected_id)
		if (selected_id === "NEW_CHILD"){
			console.debug("ExpandTasks constructing new child")
			// The user is trying to build a new dependent task

			// TODO: Bake in a 'create new task' function
			RelDBAddChild(id, "DependsOn", undefined, "Task").then(([new_EdgeID, new_TaskID]) => {
				PropsDBVertAssign(new_TaskID, {"Title": searchTerm})
			})
			

			setSelection('INVALID_ID')
			setSearchTerm("")
			grabOptions()
		} else {
			setSelection(selected_id);
		}

	}


	function onSubmitNew(e){
		console.debug("ExpandTasks Submitting new Dependency", selection)
		if(selection === "INVALID_ID"){
			console.error("ExpandTasks submission without a selected task")
			return
		} else {
			console.log("ExpandTasks Attaching existing task as dependency")
			RelDBAddChild(id, "DependsOn", selection)

		}
		setSelection('INVALID_ID')
		setSearchTerm("")
		grabOptions()
	}


	return 	<div>
				<b>Select new Dependency:</b>
				<SelectSearch
					value={selection}
					options={options}
					name="Task"
					placeholder="Pick a Task"
					search
					filterOptions={filterOptionsOrNew}
					autoFocus={false}
					onChange={onSelect}
				/>
				<div>
					<button onClick={onSubmitNew} disabled={selection === "INVALID_ID"}>Add Dependency =></button>
					<button onClick={(e) => PropsDBVertAssign(id, {"Expanded":true, "WorkStatus":0})}>Submit Dependencies</button>
				</div>
			</div>


	
}