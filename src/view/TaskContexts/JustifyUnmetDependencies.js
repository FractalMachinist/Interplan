import { useState, useEffect } from 'react'
import { useRelDBState, useTreeDBState, usePropsDBState } from "../../viewModel/Subscription_Manager.js"

export default function JustifyUnmetDependencies({id}){
	const [tree_props, _] = useTreeDBState(id)

	if(tree_props.HasUnmetDependencies){
		return <p>This task has Unmet Dependencies!</p>
	} else {
		return <p>This task has no unmet Dependencies</p>
	}
	
}