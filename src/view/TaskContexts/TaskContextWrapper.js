import { useState, useEffect } from 'react'
import { Task_DeriveStatus } from "../../viewModel/Task_VM.js"
import { useTreeDBState, usePropsDBVertState } from "../../viewModel/Subscription_Manager.js"


import ExpandTasks from "./ExpandTasks.js"
// import JustifyTaskImplication from "./JustifyTaskImplication.js"
import JustifyUnmetDependencies from "./JustifyUnmetDependencies.js"
import BeginWork from "./BeginWork.js"
import ResumeWork from "./ResumeWork.js"
import FinishWork from "./FinishWork.js"
import EndReview from "./EndReview.js"

const StateDict = {
	"NeedsExpanded": ["Add Dependencies", false, ExpandTasks],
	// "NotAbsImplied": ["Root Justification", false, JustifyTaskImplication],
	"HasUnmetDependencies": ["View Dependencies", false, JustifyUnmetDependencies],
	"WorkWaiting":["Work", true, BeginWork],
	"WorkPaused":["Work", true, ResumeWork],
	"WorkInProgress":["Work", true, FinishWork],
	"_EndReviewStatus":["Review", true, EndReview]
}



function SingleContextWrapper({id, Title, Component, InitialExpanded, disabled=false}){
	
	const [expanded, setExpanded] = useState(false)
	// console.log(`${id} SingleContextWrapper with expanded ${expanded}, InitialExpanded ${InitialExpanded}`)

	useEffect(() => {
		setExpanded(InitialExpanded)
	}, [InitialExpanded])

	return <div>
		<button disabled={disabled} onClick={(e)=>{setExpanded(!expanded)}}>
			<p>{Title}</p>
		</button>
		{expanded && !disabled ? <Component id={id}/> : null}
	</div>
}


export default function TaskContextWrapper({id}){
	const [tree_props, ] = useTreeDBState(id)
	const [props, ] = usePropsDBVertState(id)
	const [task_status, set_react_task_status] = useState([]);

	useEffect(() => {
		const new_TaskStatus = Task_DeriveStatus(props, tree_props)
		// console.log(`Looking up ${id} Task Status to`, new_TaskStatus)
		// console.log("TS has NeedsExpanded:", new_TaskStatus.includes("NeedsExpanded"))
		set_react_task_status(new_TaskStatus)
		
	}, [props, tree_props])


	// return typeof id === 'string' ? <ExpandTasks id={id}/> : null
	return <div>
		{typeof id === 'string' ? Object.entries(StateDict).map(([key, arg_pack]) => {
			const [title, strict, Component] = arg_pack
			const status_met = task_status.includes(key)
			if(status_met || !strict){
				return <SingleContextWrapper key={title} id={id} Title={title} Component={Component} InitialExpanded={status_met}/>
			} else {
				return null
			}
			
		}) : null}
	</div>

}