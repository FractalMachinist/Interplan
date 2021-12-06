import { edge_random_id, task_random_id, _task_randunique_id, is_id_edge_else_vert } from "./_random_model.js"
import { PropsDBSingleLookup_Latest } from "./Props_M.js"

import { TreeDBCheckDependency } from "./Tree_M.js"


async function _fake_db_grab_inV(id){
	const out_id = "inV_" + id.toString();
	var result = JSON.parse(window.localStorage.getItem(out_id))
	if (result !== null && result.length){
		return result
	} else {
		return null
	}
}



async function _fake_db_grab_outE(id){
	const out_id = "outE_" + id.toString();
	var result = JSON.parse(window.localStorage.getItem(out_id))
	if (result !== null && result.length){
		console.log(id, "Grabbing outE w/ valid length: ", result)
		return result
	} else {
		console.log(id, "outE is Empty! ", result)
		return []
	}
}




//////////////////////////////////////////////////////////////////




export async function RelDBLookup(id){
	if(is_id_edge_else_vert(id)){
		// Edge
		return _fake_db_grab_inV(id)
	} else {
		// Vert
		// console.log("Grabbing Vert out ID for id", id)
		return _fake_db_grab_outE(id)
	}
	
}


export async function RelDBLookup_Latest(id){
	// This function *only* indicates Active edges

	if(is_id_edge_else_vert(id)){
		// Edge
		if(await PropsDBSingleLookup_Latest(id, "Active")){
			return await _fake_db_grab_inV(id)
		} else {
			return null
		}
		
	} else {
		// Vert
		// console.log("Grabbing Vert out ID for id", id)
		const all_ids = await _fake_db_grab_outE(id)
		const active = await Promise.all(all_ids.map(async (ID) => await PropsDBSingleLookup_Latest(ID, "Active")))
		const active_ids = all_ids.filter((ID, index) => active[index])
		// console.log("RelDBLookup", active_ids)
		return active_ids
	}
	
}

export async function RelDBAssign(id, new_ids){
	if(is_id_edge_else_vert(id)){
		// Edge
		if (! (await RelDBAssign_inV(id, new_ids) )){
			console.log("RelDBAssign Failed!")
			return false
		}
	} else {
		// Vert
		if (! (await RelDBAssign_outE(id, new_ids)) ){
			console.log("RelDBAssign Failed!")
			return false
		}
	}

	// Construct an event to trigger redraws on this same page
	console.log("Triggering RelDBUpdate")
	const event = new CustomEvent(`interplan_RelDBUpdate`, {detail: {key:id, delta:new_ids}})
	document.dispatchEvent(event);
}



async function RelDBAssign_outE(id, new_ids_array){
	const props_id = "outE_" + id.toString();
	var outE_ids = await _fake_db_grab_outE(id);

	var all_ids = [].concat(outE_ids, new_ids_array)
	console.log(id, "outE Assigning new: ", all_ids)
	window.localStorage.setItem(props_id, JSON.stringify(all_ids))

	return true
}

async function RelDBAssign_inV(id, new_id){
	const props_id = "inV_" + id.toString();

	const prior_dependency = await TreeDBCheckDependency(new_id, id)
	if(!prior_dependency){
		window.localStorage.setItem(props_id, JSON.stringify(new_id))
		return true
	} else {
		window.alert("Rejected assigning Edge to form loop between ", id, new_id)
		return false
	}

	
}

export async function RelDBAddChild(parent_vert, child_vert){
	if(!is_id_edge_else_vert(parent_vert) && !is_id_edge_else_vert(child_vert)){
		const connecting_edge_ID = edge_random_id();
		RelDBAssign(parent_vert, connecting_edge_ID);
		RelDBAssign(connecting_edge_ID, child_vert);
	}
}

///////////////////////

function _fake_db_listener_factory(ID, update_fn){

	return () => {
		// console.log("Fake PropsDB Listener fac-prod running update fn", update_fn)

		var wrapped_update_fn = _standardize_events_wrapper(update_fn);
		var update_phrase = `interplan_RelDBUpdate`

		window.addEventListener('storage', wrapped_update_fn)
		document.addEventListener(update_phrase, wrapped_update_fn)


		return () => {
			console.log("CLEANING EVENT LISTENERS")
			window.removeEventListener("storage", wrapped_update_fn);
			document.removeEventListener(update_phrase, wrapped_update_fn);
		}
	}
}


///////////////////



function _standardize_events_wrapper(wrapped){
	return (e) => {

		const _from_storage = "key" in e
		var change_notice;

		if("detail" in e){
			// It's a custom notification
			change_notice = e.detail
		} else {
			// It's (probably) a storage notification
			change_notice = {
				key: e.key,
				newValue: e.newValue,
				oldValue: e.oldValue
			}
		}

		return wrapped(change_notice)

	}
}



export function RelDBListenerFactory(ID, update_fn) {
	return _fake_db_listener_factory(ID, update_fn)

}