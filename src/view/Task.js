import { useState, useEffect } from "react"
import { useRelDBOutEState, usePropsDBVertState, useTreeDBState } from "../viewModel/Subscription_Manager.js"
import { Task_DeriveStatus } from "../viewModel/Task_VM.js"


import EdgeList from "./EdgeList.js"
import TaskTitle from "./TaskTitle.js"
import TaskContextWrapper from "./TaskContexts/TaskContextWrapper.js"

import styles from "./Task.module.css"


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


	return <div className={[styles.TaskBody, locallyImplied ? styles.LImplied : styles.notLImplied].join(' ')}>
		<div className={styles.TaskData}>
			<TaskTitle id={id}/>
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
	return <div className={styles.TaskAndChildren}>
				<TaskBody id={id} locallyImplied={locallyImplied}/>
				{locallyImplied ? <ChildEdges id={id}/> : null}
			</div>
}

export default Task