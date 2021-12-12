// import ConstructPropEvent from "../model/PropTools.js"

const Schema = {
	"Vert": {
		"Task": {
			"ReviewersApproved": false,
			"Expanded": false,
			"WorkStatus": 0,
			"Title": "BLANK_TITLE",
			"LocalRoot": false
		}
	}, 
	"Edge": {
		"DependsOn": {
			"Active": false,
			"LocalSequence":0
		}
	}
}

export default function GetDefaultSchema(Vert_else_Edge, label){
	var defaults = Schema[Vert_else_Edge][label]

	// TODO: Return to idempotent properties
	// TODO: Return to Neo4j UUID generation
	defaults.id=(Date.now() + Math.random()).toString()
	return defaults

	// return Object.fromEntries(Object.entries(defaults).map(([key, prop]) => [key, ConstructPropEvent(prop)]))

}
