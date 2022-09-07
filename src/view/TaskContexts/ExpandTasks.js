import { useState, useEffect } from 'react'
import SelectSearch, { fuzzySearch } from 'react-select-search'

import styles from "../Task.module.css"

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
			console.log(`${id} ExpandTasks grabOptions getting all valid dependencies`, valid_deps)
			if (valid_deps === null) return []
			else return Promise.all(valid_deps[0].map(async (valid_dep) => { // Over each valid potential dependency
				console.debug(`${id} ExpandTasks grabOptions getting info of dependency`, valid_dep)
				return {"name":(await PropsDBVertSingleLookup_Latest(valid_dep, "Title")), "value":valid_dep} // Construct an object with their name and value for searching
			}))
		}).then(a => {console.log(a); return a}).then(setOptions) // Write the array of name/value objects into the Options array
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

			
			return fsearch_result//.slice(0, 10)

		};
	}

	async function onSelect(selected_id){
		console.debug("onSelect w/ id", selected_id)
		if (selected_id === "NEW_CHILD"){
			// console.debug(`ExpandTasks constructing new child w/ title ${searchTerm}`)
			// The user is trying to build a new dependent task

			// TODO: Bake in a 'create new task' function
			RelDBAddChild(id, "DependsOn", undefined, "Task").then(([new_EdgeID, new_TaskID]) => {
				PropsDBVertAssign(new_TaskID, {"Title": searchTerm})
			})
			

			setSelection('INVALID_ID')
			setSearchTerm("")
			grabOptions()
		} else {
			console.debug(`ExpandTasks selecting an existing task - ${selected_id}`)
			setSelection(selected_id);
		}

	}


	function onSubmitNew(e){
		console.debug("ExpandTasks Submitting new Constraint", selection)
		if(selection === "INVALID_ID"){
			console.error("ExpandTasks submission without a selected task")
			return
		} else {
			console.log("ExpandTasks Attaching existing task as constraint")
			RelDBAddChild(id, "DependsOn", selection)

		}
		setSelection('INVALID_ID')
		setSearchTerm("")
		grabOptions()
	}


	return 	<div className={styles.WithinContext}>
				<b>Select new Constraint:</b>
				<SelectSearch
					value={selection}
					options={options}
					name="Task"
					placeholder="Pick a Task"
					search
					filterOptions={filterOptionsOrNew}
					autoFocus={false}
					onChange={onSelect}
					closeOnSelect={false}
				/>
				<div>
					<button onClick={onSubmitNew} disabled={selection === "INVALID_ID"}>Add Constraint ={'>'}</button><br/>
					<button onClick={(e) => PropsDBVertAssign(id, {"Expanded":false, "WorkStatus":0})}>Continue Constraining</button>
					<button onClick={(e) => PropsDBVertAssign(id, {"Expanded":true, "WorkStatus":0})}>Finished Constraining</button>
				</div>
			</div>


	
}