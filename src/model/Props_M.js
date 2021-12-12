import { Transaction, DB_Listener_Factory } from "./Neo4j_Backer.js"

export async function PropsDBVertLookup(id){
	const C_Lookup = `MATCH (n {id: "${id}"}) RETURN n{.*} as props`
	return Transaction(
		C_Lookup,
		"PropsDBVertLookup"
	)

}

export async function PropsDBVertLookup_Latest(id){
	return PropsDBVertLookup(id)
	// const prop_map = await PropsDBLookup(id);

	// return Object.fromEntries(
	// 	Object.entries(prop_map).map(
	// 		([prop_name, prop_history]) => [prop_name, LatestUpdate(prop_history)]
	// 	)
	// )	
}



export async function PropsDBVertSingleLookup(id, prop_name){
	const prop_map = await PropsDBVertLookup(id);
	return prop_map[prop_name]
}

export async function PropsDBVertSingleLookup_Latest(id, prop_name){
	const prop_map = await PropsDBVertLookup_Latest(id);
	return prop_map[prop_name]
}



export async function PropsDBVertAssign(id, new_props){
	const C_Assign = `MATCH (n {id: "${id}"}) SET n += $new_props`

	Transaction(
		C_Assign,
		"PropsDBVertAssign",
		{"new_props":new_props},
		"Write",
		false
	).then((result)=>{
		const event = new CustomEvent(`interplan_PropsDB_Update`, {detail: {key: id, delta: new_props}})
		document.dispatchEvent(event)	
		return result
	})

}



//-----------------------------------------------------
export async function PropsDBEdgeLookup(id){
	const C_Lookup = `MATCH ()-[n {id: "${id}"}]->() RETURN n{.*} as props`
	return Transaction(
		C_Lookup,
		"PropsDBEdgeLookup"
	)

	// const props_id = "props_" + id.toString();

	// if(!window.localStorage.getItem(props_id)) {
	// 	console.log("Generating some new history")
	// 	window.localStorage.setItem(props_id, JSON.stringify(_fake_novel_entry()))
	// }

	// return JSON.parse(window.localStorage.getItem(props_id))
}

export async function PropsDBEdgeLookup_Latest(id){
	return PropsDBEdgeLookup(id)
	// const prop_map = await PropsDBLookup(id);

	// return Object.fromEntries(
	// 	Object.entries(prop_map).map(
	// 		([prop_name, prop_history]) => [prop_name, LatestUpdate(prop_history)]
	// 	)
	// )	
}



export async function PropsDBEdgeSingleLookup(id, prop_name){
	const prop_map = await PropsDBEdgeLookup(id);
	return prop_map[prop_name]
}

export async function PropsDBEdgeSingleLookup_Latest(id, prop_name){
	const prop_map = await PropsDBEdgeLookup_Latest(id);
	return prop_map[prop_name]
}



export async function PropsDBEdgeAssign(id, new_props){
	const C_Assign = `MATCH ()-[n {id: "${id}"}]->() SET n += $new_props`

	Transaction(
		C_Assign,
		"PropsDBEdgeAssign",
		{"new_props":new_props},
		"Write",
		false
	).then((result)=>{
		const event = new CustomEvent(`interplan_PropsDB_Update`, {detail: {key: id, delta: new_props}})
		document.dispatchEvent(event)	
		return result
	})

}



export function PropsDBListenerFactory(ID, update_fn) {
	return () => {

		var update_phrase = `interplan_PropsDB_Update`

		document.addEventListener(update_phrase, update_fn)
		
		const clear_db_listener = DB_Listener_Factory(update_fn);

		return () => {
			document.removeEventListener(update_phrase, update_fn);
			clear_db_listener()
		}
	}

}