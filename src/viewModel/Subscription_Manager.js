import { useState, useEffect, useCallback } from "react";
import { PropsDBVertLookup_Latest, PropsDBVertAssign, PropsDBEdgeLookup_Latest, PropsDBEdgeAssign, PropsDBListenerFactory } from "../model/Props_M.js"
import { RelDBLookupOutE, RelDBLookupOutV, RelDBAddChild, RelDBListenerFactory } from "../model/Rel_M.js"
import { TreeDBLookup, TreeDBListenerFactory } from "../model/Tree_M.js"
import eq from "../Tools/SetTools.js"

// export const useRelDBState = (id) => useDBConstructor(RelDBLookupOutE, RelDBAddChild, RelDBListenerFactory)(id);
export const useRelDBOutEState = (id) => useDBConstructor(RelDBLookupOutE, RelDBAddChild, RelDBListenerFactory)(id);
export const useRelDBOutVState = (id) => useDBConstructor(RelDBLookupOutV, (id, value)=>{}, RelDBListenerFactory)(id);
export const usePropsDBEdgeState = (id) => useDBConstructor(PropsDBEdgeLookup_Latest, PropsDBEdgeAssign, PropsDBListenerFactory)(id);
export const usePropsDBVertState = (id) => useDBConstructor(PropsDBVertLookup_Latest, PropsDBVertAssign, PropsDBListenerFactory)(id);
export const useTreeDBState = (id) => useDBConstructor(TreeDBLookup, (id, value) => {}, TreeDBListenerFactory)(id); 

export function useDBConstructor(Lookup, Assign, ListenerFactory){
	function AnonUseDBState(ID) {
		const [value, setValue] = useState({});

		const m_SetIfChanged = useCallback((new_value) => {
			// This needs to compare sets, objects, and mixtures of the two

			if(!eq(value, new_value)){
				setValue(new_value)
			}
		}, [value])


		// Write initial value to react state
		useEffect(() => {
			if(typeof ID !== 'string' ){
				return;
			}
			Lookup(ID).then(m_SetIfChanged)
		}, [m_SetIfChanged, ID])


		// Write changes in the DB back to the state
		const UpdateListener = ListenerFactory(ID, (change_notice) => {
			return typeof ID === 'string' ? Lookup(ID).then(m_SetIfChanged) : null
		})

		// console.log("PUL ", PropUpdateListener)

		useEffect(UpdateListener, [m_SetIfChanged, UpdateListener, ID])

		return [value, (new_value)=>{return Assign(ID, new_value)}];
	}

	return AnonUseDBState
	
}

