import { useState, useEffect } from 'react'
// import { TaskOutboundEdgeIDsGrabOnce } from '../viewModel/Task_VM.js'
// import { GrabAllLatestIdemProps, SetIdemProps } from "../viewModel/IdempotentProp.js"

import { useRelDBState, useTreeDBState, usePropsDBState } from "../viewModel/Subscription_Manager.js"


import EdgeList from "./EdgeList.js"
import TaskTitle from "./TaskTitle.js"
import TaskContextWrapper from "./TaskContexts/TaskContextWrapper.js"

import styles from "./Task.module.css"


function TaskBody({id, locallyImplied}){
	return <div className={[styles.TaskBody, locallyImplied ? styles.LImplied : styles.notLImplied].join(' ')}>
		<div className={styles.TaskData}>
			<TaskTitle id={id}/>
			{locallyImplied ? <TaskContextWrapper id={id}/> : null }
		</div>
	</div>
}

function ChildEdges({id}){
	const [edgeIDs, setEdgeIDs] = useRelDBState(id)
	console.log("ChildEdges EdgeIds: ", edgeIDs, Array.isArray(edgeIDs) && edgeIDs.length)
	return (Array.isArray(edgeIDs) && edgeIDs.length) ? <EdgeList ids={edgeIDs}/> : null
}


function Task({id, locallyImplied}) {
	return <div className={styles.TaskMain}>
				<TaskBody id={id} locallyImplied={locallyImplied}/>
				{locallyImplied ? <ChildEdges id={id}/> : null}
			</div>
}

export default Task