import { useState, useEffect } from 'react'

import { useRelDBState, useTreeDBState, usePropsDBState } from "../../viewModel/Subscription_Manager.js"


export default function Review({id, editable}){
	const [reviewer_ID, kindly_do_not] = useRelDBState(id);
	const [props, setProps] = usePropsDBState(id);


	return <div>
		<p>Review by {JSON.stringify(reviewer_ID)}</p>
	</div>


}