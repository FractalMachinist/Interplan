import { is_id_edge_else_vert, _get_absolute_root } from "./_random_model.js"
import { RelDBLookup, RelDBLookup_Latest } from "./Rel_M.js"

import { PropsDBSingleLookup_Latest } from "./Props_M.js"

async function _fake_TreeDB_CheckDependency(fromID, toID, strictly_active=true){
	if(fromID == toID){
		return true
	}

	var getChildIDs
	if(strictly_active){
		getChildIDs = RelDBLookup_Latest
	} else {
		getChildIDs = RelDBLookup
	}

	var ActiveIDs;

	if(is_id_edge_else_vert(fromID)){
		ActiveIDs = [fromID];
	} else {
		ActiveIDs = await getChildIDs(fromID)
		console.log("TreeDep First Vert IDs: ", ActiveIDs)
	}

	// ActiveIDs is currently an array of Edge IDs
	var edge_else_vert = true


	while(true){
		if(ActiveIDs.length === 0){
			console.log(`Validate ${fromID} to ${toID} !DEP - No future`)
			return false;
		}

		if(ActiveIDs.includes(toID)){
			console.log(`Validate ${fromID} to ${toID} DEP - found toID`)
			return true;
		}

		var new_IDs = [...new Set(await Promise.all(ActiveIDs.map(getChildIDs)))];
		console.log(`IDs updating ${ActiveIDs} -> -${new_IDs}-`)

		if(edge_else_vert){
			ActiveIDs = [].concat(new_IDs).filter(id=>id!==null)
		} else {
			console.log("Vert type out IDs: ", new_IDs)
			ActiveIDs = [].concat(...new_IDs)
		}

		edge_else_vert = !edge_else_vert
		

		if(ActiveIDs.includes(fromID)){
			window.alert(`${fromID} loops back on itself!`)
		}
		console.log("ActiveIDs:", ActiveIDs)
	}
}

function _fake_TreeDB_listener_factory(ID, update_fn){
	return () => {
		var wrapped_update_fn = update_fn

		window.addEventListener('storage', wrapped_update_fn)
		document.addEventListener('interplan_RelDBUpdate', wrapped_update_fn)
		document.addEventListener(`interplan_PropsDB_Update`, wrapped_update_fn)


		return () => {
			window.removeEventListener("storage", wrapped_update_fn);
			document.removeEventListener("interplan_RelDBUpdate", wrapped_update_fn);
			document.removeEventListener(`interplan_PropsDB_Update`, wrapped_update_fn)
		}
	}
}

async function _fake_TreeDB_AllTasks(){
	return JSON.parse(window.localStorage.getItem("ALL_TASKS"))
}

async function _fake_TreeDB_ValidNewDep_Tasks(ID){
	const all_tasks = await _fake_TreeDB_AllTasks()
	const invalid = await Promise.all(all_tasks.map(async (any_ID) => {
		return (await TreeDBCheckDependency(any_ID, ID, false))
	}))

	
	const valid_tasks = all_tasks.filter((id, index) => {return !invalid[index]})

	console.log(`${ID} ValidNewDep Valid:`, valid_tasks)
	return valid_tasks
}


///////////////////////

/* Exports:

- ?Absolutely Implied
- ?Unmet Dependencies

*/


export async function TreeDBTaskAbsoluteImplied(id){
	return TreeDBCheckDependency(_get_absolute_root(), id)
}

export async function TreeDBCheckDependency(fromID, toID, strictly_active=true){
	return _fake_TreeDB_CheckDependency(fromID, toID, strictly_active)
}

export async function TreeDBHasUnmetDependencies(id){
	// VERY VERY TEMPORARY
	// return Math.random() < 0.5
	var blocking_dependencies = await RelDBLookup_Latest(id)

	if(!is_id_edge_else_vert(id)){
		blocking_dependencies = [].concat(...(await Promise.all(blocking_dependencies.map(RelDBLookup_Latest))))
	}

	console.log(`${id} blocking_dependencies:`, blocking_dependencies)

	const work_status_complete = await Promise.all(blocking_dependencies.map(async (blocking_id) => {
		return (await PropsDBSingleLookup_Latest(blocking_id, "WorkStatus")) === 2
	}))

	console.log(`${id} work_status_complete:`, work_status_complete)

	const Dep = blocking_dependencies.filter((id, index) => {return !work_status_complete[index]})

	console.log(`Looking up unmet Dep on id ${id}:`, Dep)
	return Dep.length > 0

}

export async function TreeDBLookup(id){
	console.log("TreeDB Looking up", id)
	const AbsImp = await TreeDBTaskAbsoluteImplied(id);
	const UnmetDep = await TreeDBHasUnmetDependencies(id);
	return {
		"AbsolutelyImplied": AbsImp,
		"HasUnmetDependencies": UnmetDep
	}
}

export function TreeDBListenerFactory(ID, update_fn){
	return _fake_TreeDB_listener_factory(ID, update_fn)
}

export async function TreeDBGetValidNewTaskDependencies(ID){
	return _fake_TreeDB_ValidNewDep_Tasks(ID);
}