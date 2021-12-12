import { Transaction, DB_Listener_Factory } from "./Neo4j_Backer.js"
import GetDefaultSchema from "../Meta_Model/GetDefaultSchema.js"

import { TreeDBCheckDependency } from "./Tree_M.js"


export async function RelDBLookupOutE(id){
	const C_Match = `p {id: "${id}"}`
	const C_Lookup = `MATCH (${C_Match})-[o]->()`
	const C_Return = `${C_Lookup} RETURN collect(o.id) as OutE`

	return Transaction(
		C_Return,
		"RelDBLookupOutE"
	).then((out_edges)=>{
		return new Set(out_edges)
	})
}


export async function RelDBLookupOutE_Latest(id){
	// This function *only* indicates Active edges
	const C_Match = `p {id: "${id}"}`
	const C_Lookup = `MATCH (${C_Match})-[o {Active: true}]->()`
	const C_Return = `${C_Lookup} RETURN collect(o.id) as OutE`

	return Transaction(
		C_Return,
		"RelDBLookupOutELatest"
	).then((out_edges)=>{
		return new Set(out_edges)
	})
}

// -----------------

export async function RelDBLookupOutV(id){
	const C_Match = `p {id: "${id}"}`
	const C_Lookup = `MATCH ()-[${C_Match}]->(o)`
	const C_Return = `${C_Lookup} RETURN o.id as OutV`

	return Transaction(
		C_Return,
		"RelDBLookupOutV"
	)
}

// -----------------


export async function RelDBAddChild(parent_vert, edge_label, child_vert=undefined, child_label=undefined, use_schema=true){

	var C_ChildReference, C_ChildWhereTest
	var child_props = {"id":(Date.now()+Math.random()).toString()}, edge_props = {"id":(Date.now()+Math.random()).toString()}
	var CreateChild = (typeof child_vert === 'undefined')


	// Do we need to construct the child vert?
	if(CreateChild){
		if(typeof child_label === 'undefined'){
			throw new TypeError("RelDBAddChild must define either child_vert or child_label")
		}

		/* We need to create a new Child Vert
		That means we need to:
			- Set C_ChildMatch to "", because we're not matching any vert
			- Set C_ChildWhereTest to "", because we're not matching any vert
			- Set C_ChildReference to implicitely create the Child Vert while we create the edge
		*/ 

		C_ChildWhereTest = ""

		// This inserts a stable UUID, because Neo4J internal IDs are subject to change
		// This sets up inserting an 'idem_props' property, where idempotentially-managed props get stored
		// var child_props_str = ConstructNewCPropString("child_props")
		var child_props_str = "$child_props"

		if(use_schema){
			child_props = GetDefaultSchema("Vert", child_label)
		}

		C_ChildReference = `(c:${child_label}:IDSPACE ${child_props_str})`
	
	} else { // We already have a Child Vert, we just need to reference it
		// Check if the given child vert is a valid dependency

		if(await TreeDBCheckDependency(parent_vert, child_vert)){
			const message = `RelDBAddChild Will Not create a dependency loop between ${parent_vert} and ${child_vert}`
			window.alert(message)
			throw message
		}

		C_ChildWhereTest = `c.id = "${child_vert}"`
		C_ChildReference = "(c)"
	}

	// Before we construct our query, let's define the edge_props
	if(use_schema){
		edge_props = GetDefaultSchema("Edge", edge_label)
	}
	
	const edge_props_str = "$edge_props"
	// edge_props_str = ConstructNewCPropString("edge_props")


	// We've done our looking-up, it's time to construct our query
	const C_Match = `MATCH (p)${CreateChild ? "" : `,${C_ChildReference}`}`
	const C_Where = `WHERE p.id = "${parent_vert}"${CreateChild ? "" : ` AND ${C_ChildWhereTest}`}`
	const C_Create = `CREATE (p)-[e:${edge_label} ${edge_props_str}]->${C_ChildReference}`
	const C_Return = "RETURN e.id as a,c.id as b" // Naming, because the products are alphabetized later on and I want the edge to be first

	const C_RelDBAddChild = [C_Match, C_Where, C_Create, C_Return].join(" ")


	// Construct a session, run our query
	return Transaction(
		C_RelDBAddChild, 
		"RelDBAddChild", 
		{"child_props": child_props, "edge_props": edge_props}, 
		"Write",
		undefined,	// Use the default for auto_strip
		false		// Override the default and keep the results grouped by record, not by property
	).then((result)=>{
		const event = new CustomEvent(`interplan_RelDBUpdate`, {detail: {key: parent_vert}})
		document.dispatchEvent(event)	
		console.log(`${parent_vert} RelDBAddChild finished with result`, result)
		return result
	})


}


export function RelDBListenerFactory(ID, update_fn) {
	return () => {
		// console.log("Fake PropsDB Listener fac-prod running update fn", update_fn)

		var update_phrase = `interplan_RelDBUpdate`

		const clear_db_listener = DB_Listener_Factory(update_fn);
		document.addEventListener(update_phrase, update_fn)


		return () => {
			document.removeEventListener(update_phrase, update_fn);
			clear_db_listener()
		}
	}

}