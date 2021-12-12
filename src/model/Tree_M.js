import { Transaction, DB_Listener_Factory } from "./Neo4j_Backer.js"

/* Exports:

- ?Absolutely Implied
- ?Unmet Dependencies

*/


export async function TreeDBTaskAbsoluteImplied(id){
	const C_TaskAbsolutelyImplied = `MATCH (task {id: "${id}"}) OPTIONAL MATCH (task)<-[:DependsOn*]-(Root {AbsoluteRoot: true}) RETURN Root IS NOT NULL OR task.AbsoluteRoot as AbsolutelyImplied`
	return Transaction(
		C_TaskAbsolutelyImplied,
		"TreeDBTaskAbsoluteImplied"
	)
}

export async function TreeDBCheckDependency(fromID, toID, strictly_active=true){
	// If there's any dependent path from fromID to toID, return True
	// if strictly_active, require that path to only traverse active edges
	if (fromID === toID){
		return true
	}
	// TODO: Allow other dependent edge labels
	const C_CheckDependency = `MATCH (from {id: "${fromID}"}),(to {id: "${toID}"}) OPTIONAL MATCH path=(from)-[:DependsOn* ${strictly_active ? "{Active: true}" : ""}]->(to) RETURN COUNT(path)>0 as Dependent`
	return Transaction(
		C_CheckDependency,
		"TreeDBCheckDependency"
	)

}



export async function TreeDBHasUnmetDependencies(id){
	// Return an array of incomplete tasks which id depends on
	// TODO: Allow other dependent edge labels
	// TODO: Update to care about review

	const C_Dependency = "(from)-[:DependsOn* {Active: true}]->(UnmetDependency:Task)"
	const C_DependencyIsUnmet = "UnmetDependency.WorkStatus <> 3"
	const C_DependencyIsTerminal = "ALL(SD in [(UnmetDependency)-[:DependsOn* {Active: true}]->(SD:Task) | SD] WHERE SD.WorkStatus = 3)"
	// const C_DependencyIsTerminal = C_DependencyIsUnmet
	const C_UnmetDependencies = `MATCH (from {id: "${id}"}) OPTIONAL MATCH ${C_Dependency} WHERE ${C_DependencyIsUnmet} AND ${C_DependencyIsTerminal} RETURN COLLECT(DISTINCT UnmetDependency.id) as UnmetDependencies`
	



	return Transaction(
		C_UnmetDependencies,
		"TreeDBHasUnmetDependencies"
	)
}

export async function TreeDBLookup(id){
	// console.log("TreeDB Looking up", id)
	const AbsImp = await TreeDBTaskAbsoluteImplied(id);
	const UnmetDep = await TreeDBHasUnmetDependencies(id);
	return {
		"AbsolutelyImplied": AbsImp,
		"HasUnmetDependencies": UnmetDep
	}
}



export async function TreeDBGetValidNewDependencies(id){
	// From some origin @id, find all Tasks which could become dependencies of that origin

	// TODO: Expand to other types of Dependencies/etc
	const C_NotDepOnOrigin = "NONE(path in (valid)-[:DependsOn*]->(origin) WHERE path IS NOT null)"
	const C_OriginNotParentOf = "NONE(path in (origin)-[:DependsOn]->(valid) WHERE path IS NOT null)"
	const C_NotOrigin = "valid.id <> origin.id"
	const C_GetValidNewDependencies = `MATCH (origin {id: "${id}"}) OPTIONAL MATCH (valid:Task) WHERE ${C_NotDepOnOrigin} AND ${C_OriginNotParentOf} AND ${C_NotOrigin} RETURN COLLECT(DISTINCT(valid.id)) as ValidNewDependencies`

	return Transaction(
		C_GetValidNewDependencies,
		"TreeDBGetValidNewDependencies"
	)
}


export function TreeDBListenerFactory(id, update_fn){
	return () => {

		const clear_db_listener = DB_Listener_Factory(update_fn);
		document.addEventListener('interplan_RelDBUpdate', update_fn)
		document.addEventListener(`interplan_PropsDB_Update`, update_fn)


		return () => {
			clear_db_listener()
			document.removeEventListener("interplan_RelDBUpdate", update_fn);
			document.removeEventListener(`interplan_PropsDB_Update`, update_fn)
		}
	}
}

