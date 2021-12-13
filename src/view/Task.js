import { useState, useEffect } from "react"
import { useRelDBOutEState, usePropsDBVertState, useTreeDBState } from "../viewModel/Subscription_Manager.js"
import { Task_DeriveStatus } from "../viewModel/Task_VM.js"


import EdgeList from "./EdgeList.js"
import TaskTitle from "./TaskTitle.js"
import TaskContextWrapper from "./TaskContexts/TaskContextWrapper.js"

import styles from "./Task.module.css"
import common_styles from "./common.module.css"

const StatusStyles = {
	"NeedsExpanded":styles.NeedsExpanded,
	"NotAbsImplied": styles.notLImplied,
	"HasUnmetDependencies": styles.NeedsExpanded,
	"WorkWaiting": styles.WorkWaiting,
	"WorkPaused": styles.WorkPaused,
	"WorkInProgress": styles.WorkInProgress,
	"_EndReviewStatus": styles._EndReviewStatus,

}

function TaskBody({id, locallyImplied}){
	const [props, setProps] = usePropsDBVertState(id)
	const [tree_props,] = useTreeDBState(id)
	const [task_status, set_react_task_status] = useState([]);


	useEffect(() => {
		const new_TaskStatus = Task_DeriveStatus(props, tree_props)
		// console.log(`Looking up ${id} Task Status to`, new_TaskStatus)
		// console.log("TS has NeedsExpanded:", new_TaskStatus.includes("NeedsExpanded"))
		set_react_task_status(new_TaskStatus)
		
	}, [props, tree_props])

	var multiStyle = [styles.TaskBody]

	if(locallyImplied){
		task_status.map((status)=>{
			multiStyle.push(StatusStyles[status])
		})
	} else {
		multiStyle.push(styles.notLImplied)
	}

	return <div className={multiStyle.join(' ')}>
		<div className={locallyImplied ? styles.TaskData : styles.TaskDataMinimized}>
			<TaskTitle id={id} minimized={!locallyImplied}/>
			{locallyImplied ? <TaskContextWrapper id={id}/> : null }
		</div>
	</div>
}

function ChildEdges({id, default_expand_EdgeList}){
	const [edgeIDsSet,] = useRelDBOutEState(id)


	if (edgeIDsSet instanceof Set && edgeIDsSet.size > 0) {
		return <EdgeList ids={Array.from(edgeIDsSet)} default_expand_EdgeList={default_expand_EdgeList ? undefined : false}/>
	} else {
		return null
	}
}


function Task({id, locallyImplied}) {
	return <div className={[styles.TaskAndChildren].join(' ')}>
				<TaskBody id={id} locallyImplied={locallyImplied}/>
				{locallyImplied ? <ChildEdges id={id}/> : null}
			</div>
}

export default Task