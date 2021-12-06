import { useState, useEffect, useRef } from "react";
import { PropsDBLookup_Latest, PropsDBAssign, PropsDBListenerFactory } from "../model/Props_M.js"
import { RelDBLookup, RelDBAssign, RelDBListenerFactory } from "../model/Rel_M.js"
import { TreeDBLookup, TreeDBListenerFactory } from "../model/Tree_M.js"

export const useRelDBState = (id) => useDBConstructor(RelDBLookup, RelDBAssign, RelDBListenerFactory)(id);
export const usePropsDBState = (id) => useDBConstructor(PropsDBLookup_Latest, PropsDBAssign, PropsDBListenerFactory)(id);
export const useTreeDBState = (id) => useDBConstructor(TreeDBLookup, (id, value) => {}, TreeDBListenerFactory)(id); 

export function useDBConstructor(Lookup, Assign, ListenerFactory){
	function AnonUseDBState(ID) {
		const [value, setValue] = useState({});
		// const needsInit = useRef(1) // Wait for the two mounting triggers before listening to changes

		// Write initial value to react state
		useEffect(() => {
			if(typeof ID !== 'string' ){
				return;
			}
			Lookup(ID).then(setValue)
		}, [ID])






		// // Write changes out to the DB
		// useEffect(() => {
		// 	if(typeof ID !== 'string' ){
		// 		console.log(ID, "Is empty")
		// 		return;
		// 	}
		// 	if(needsInit.current == 0){
		// 		console.log(ID, "StateDB Writing to DB", value)
		// 		Assign(ID, value);
		// 	} else {
		// 		console.log(ID, "StateDB Delaying writing to DB - ", needsInit.current)
		// 		needsInit.current = Math.max(0, needsInit.current - 1)
		// 	}
			
		// }, [value]);



		// Write changes in the DB back to the state
		const UpdateListener = ListenerFactory(ID, async (change_notice) => {
			return typeof ID === 'string' ? await Lookup(ID).then(setValue) : null
		})

		// console.log("PUL ", PropUpdateListener)

		useEffect(UpdateListener, [ID])

		return [value, (new_value)=>{Assign(ID, new_value)}];
	}

	return AnonUseDBState
	
}

