import { useState, useEffect } from 'react'

import { useRelDBOutVState, useTreeDBState, usePropsDBState } from "../../viewModel/Subscription_Manager.js"


export default function Review({id, editable}){
	const [reviewer_ID, kindly_do_not] = useRelDBOutVState(id);
	const [props, setProps] = usePropsDBState(id);


	return <div>
		<p>Review by {JSON.stringify(reviewer_ID)}</p>
	</div>


}