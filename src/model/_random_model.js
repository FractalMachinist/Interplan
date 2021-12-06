import { TreeDBCheckDependency } from "./Tree_M.js"
import { RelDBAssign } from "./Rel_M.js"


function _ready_task_ID(new_ID){
	var all_tasks = [... new Set(JSON.parse(window.localStorage.getItem("ALL_TASKS")))]
	all_tasks.push(new_ID)
	window.localStorage.setItem("ALL_TASKS", JSON.stringify(all_tasks))
}

function task_random_id() {
	const new_ID = "TASK_"+(Math.random() + 1).toString(36).substring(7, 8)
	_ready_task_ID(new_ID)

	return new_ID
	// return "TASK_"+(Math.random() + 1).toString(10).substring(7, 8)
	// return Math.random() > 0.5 ? "TASK_a" : "TASK_b"
}

export function _task_randunique_id(){
	const new_ID = "TASK_"+(Math.random() + 1).toString(36).substring(2)
	_ready_task_ID(new_ID)

	return new_ID
}

export function _get_absolute_root(){
	return window.localStorage.getItem("ABSOLUTE_ROOT")
}

function _validate_edge_is_new(proposal){
	return !window.localStorage.getItem("props_" + proposal.toString())
}

export function edge_random_id() {
	// console.log("Running Edge Random ID")
	while(true){
		const proposal = "EDGE_"+(Math.random() + 1).toString(36).substring(2)
		if(_validate_edge_is_new(proposal)) {
			// console.log("Approved random edge ID", proposal)
			return proposal 
		}
	} 

}

export function is_id_edge_else_vert(id){
	return id[0] == "E" ? true : false
}

export async function _build_random_tree(root_id){
	window.localStorage.clear();

	window.localStorage.setItem("ABSOLUTE_ROOT", root_id);
	window.localStorage.setItem("ALL_TASKS", JSON.stringify([root_id]))

	// How many nodes in total?
	const max_nodes = Math.floor(Math.random()*3)+6

	var tracked_verts = [root_id];

	

	for(var i = 0; i<max_nodes;i++){

		var proposed_task = task_random_id(); // Intentionally testing with possible collisions
		console.log("Proposing task", proposed_task)
		var proposed_task_used = false;
		for(var j = 0; j<Math.min(3, Math.max(1, tracked_verts.length-3)); j++){

			var proposed_parent = tracked_verts[Math.floor(tracked_verts.length * Math.random())]
			console.log("    Proposing Parent", proposed_parent)
			const prior_dependency = await TreeDBCheckDependency(proposed_task, proposed_parent)
			if(!prior_dependency){
				console.log("    Proposal Approved!")
				const proposed_edge = edge_random_id()
				await RelDBAssign(proposed_parent, proposed_edge);
				await RelDBAssign(proposed_edge, proposed_task);
				console.log("  --Parent Proposal Completed")

				proposed_task_used=true
			} else {
				console.log("    Avoided invalid pairing between ", proposed_parent, proposed_task)
			}
		}

		if(proposed_task_used){

			tracked_verts.push(proposed_task)
			console.log("PUSHING TO LIST", tracked_verts)
		}
			
	}




}