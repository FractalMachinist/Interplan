import { useState, useEffect } from 'react'
import { useRelDBState, useTreeDBState, usePropsDBState } from "../../viewModel/Subscription_Manager.js"

export default function BeginWork({id}){
	const [props, setProps] = usePropsDBState(id)

	return <div>
		<p>Ready to begin!</p>
		<button onClick={(e)=>setProps({"WorkStatus":1})}>Begin!</button>
	</div>
	
}