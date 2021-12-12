export function ConstructPropEvent(value){
	const now = new Date()
	const PropEvent = {"timestamp": new window.neo4j.types.DateTime(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDay(),
		now.getUTCHours(),
		now.getUTCMinutes(),
		now.getUTCSeconds(),
		now.getUTCMilliseconds()*1000000, // Neo4J chose Nanoseconds, who am I to judge?
		0 // Timezone Offset in Seconds - UTC
	), "prop": value}

	return PropEvent
}

export function ConstructNewCPropString(props_name){
	// Deprecated for now
	// return `{id: apoc.create.uuid(), idem_props: $${props_name}}`
}