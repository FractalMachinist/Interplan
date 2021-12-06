import { useState, useEffect } from 'react'
import { useRelDBState, useTreeDBState, usePropsDBState } from "../../viewModel/Subscription_Manager.js"

export default function FinishWork({id}){
	const [props, setProps] = usePropsDBState(id)

	return <div>
		<p>How's it going?</p>
		<button onClick={(e)=>setProps({"WorkStatus":2})}>Done</button>
	</div>
	
}