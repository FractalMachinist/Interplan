import { Transaction, DB_Listener_Factory } from "./Neo4j_Backer.js"

/* Exports:

- ?Absolutely Implied
- ?Unmet Dependencies

*/

export async function TreeDBGetAllLocalRoot(){
	const C_GetAllLocalRoot = `MATCH (task:Task {LocalRoot: true}) return COLLECT(task.id)`
	return Transaction(
		C_GetAllLocalRoot,
		"TreeDBGetAllLocalRoot"
	)
}

export async function TreeDBTaskAbsoluteImplied(id){
	const C_TaskAbsolutelyImplied = `MATCH (task:IDSPACE {id: "${id}"}) WITH exists((task)<-[:DependsOn*0.. {Deleted: false, Active: true}]-({AbsoluteRoot: true})) as AbsImp RETURN AbsImp`
	return Transaction(
		C_TaskAbsolutelyImplied,
		"TreeDBTaskAbsoluteImplied"
	)
}

export async function TreeDBCheckDependency(fromID, toID, strictly_active=false){
	// If there's any dependent path from fromID to toID, return True
	// if strictly_active, require that path to only traverse active edges
	if (fromID === toID){
		return true
	}
	// TODO: Allow other dependent edge labels
	const C_RespectActivity = `{Deleted: false${strictly_active ? ", Active: true}" : ""}}`
	const C_CheckDependency = `MATCH (from {id: "${fromID}"}),(to {id: "${toID}"}) OPTIONAL MATCH path=(from)-[:DependsOn* ${C_RespectActivity}]->(to) RETURN COUNT(path)>0 as Dependent`
	return Transaction(
		C_CheckDependency,
		"TreeDBCheckDependency"
	)

}



export async function TreeDBHasUnmetDependencies(id){
	// Return an array of incomplete tasks which id depends on
	// TODO: Allow other dependent edge labels
	// TODO: Update to care about review

	const C_Dependency = "(from)-[:DependsOn* {Deleted: false, Active: true}]->(UnmetDependency:Task)"
	const C_DependencyIsUnmet = "UnmetDependency.WorkStatus <> 3"
	const C_DependencyIsTerminal = "ALL(SD IN [(UnmetDependency)-[:DependsOn* {Deleted: false, Active: true}]->(SD:Task) | SD] WHERE SD.WorkStatus = 3.0) "
	// const C_DependencyIsTerminal = C_DependencyIsUnmet
	const C_UnmetDependencies = `MATCH (from:IDSPACE {id: "${id}"}) OPTIONAL MATCH ${C_Dependency} WITH DISTINCT UnmetDependency WHERE ${C_DependencyIsUnmet} WITH UnmetDependency WHERE ${C_DependencyIsTerminal} RETURN COLLECT(DISTINCT UnmetDependency.id) as UnmetDependencies`
	



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


export async function TreeDBGetValidNewDependencies(id, label, limit=0){
	// From some origin @id, find all Tasks which could become dependencies of that origin

	// TODO: Expand to other types of Dependencies/etc
	const C_NotDepOnOrigin = "NOT exists((valid)-[:DependsOn* {Deleted: false}]->(origin))"
	const C_OriginNotParentOf = "NOT exists((origin)-[:DependsOn {Deleted: false, Active: true}]->(valid))"
	const C_NotOrigin = "valid.id <> origin.id"
	const C_LimitDeps = limit === 0 ? "" : `LIMIT ${limit}`
	const C_GetValidNewDependencies = `MATCH (origin:Task {id: "${id}"}) OPTIONAL MATCH (valid:Task) WHERE ${C_NotDepOnOrigin} AND ${C_NotOrigin} AND ${C_OriginNotParentOf} RETURN DISTINCT(valid.id) as ValidNewDependencies ${C_LimitDeps}`

	console.log("TreeDBGetValidNewDependencies Query: ", C_GetValidNewDependencies)

	return Transaction(
		C_GetValidNewDependencies,
		"TreeDBGetValidNewDependencies",
		{},
		"Read",
		true,
		true,
		false
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

