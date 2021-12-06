import { useState, useEffect } from 'react'
import { useRelDBState, useTreeDBState, usePropsDBState } from "../../viewModel/Subscription_Manager.js"

export default function JustifyTaskImplication({id}){
	const [tree_props, _] = useTreeDBState(id)

	if(tree_props.AbsolutelyImplied){
		return <p>This task is Absolutely Implied!</p>
	} else {
		return <p>This task is not implied by the Root.</p>
	}
	
}