import { useState, useEffect } from 'react'
import Task from "./Task.js"
// import { EdgeOutboundVertIDGrabOnce } from "../viewModel/Edge_VM.js"
import { useRelDBState, useTreeDBState, usePropsDBState } from "../viewModel/Subscription_Manager.js"

import styles from "./EdgeList.module.css"

function Edge({id}) {
	const [outboundVertID, setReactOutboundIDs] = useRelDBState(id)
	const [edgeProps, setEdgeProps] = usePropsDBState(id)

	return <div className={styles.EdgeMain}>
				{/*<p>Edge w/ ID {id}</p>*/}
				{/*{PropsElem}*/}
				<div className={styles.EdgeButtonDiv}>
					{ edgeProps.Active ? (<button className={styles.EdgeButton} onClick={(e) => setEdgeProps({Active: false})}>-</button>) : null}
					{!edgeProps.Active ? (<button className={styles.EdgeButton} onClick={(e) => setEdgeProps({Active:  true})}>+</button>) : null}
					{/*<button className={styles.EdgeButton} onClick={() => forwardProps({status: 2})}>2</button>*/}
				</div>
				{outboundVertID ? <Task id={outboundVertID} locallyImplied={edgeProps.Active}/> : null}
			</div>



}


function EdgeList({ids}) {
	const [GUI_Expanded, setGUI_Expanded] = useState(true);



	let ExpansionElem;


	return GUI_Expanded ? (
			<div className={styles.Expanded}>
				<button onClick={() => setGUI_Expanded(false)}>-</button>
				<div className={styles.ELMain}>{ids.map(id => <Edge key={id} id={id}/>)}</div>
			</div>) 
		: 
		(
			<div className={styles.Retracted}>
				<button onClick={() => setGUI_Expanded(true)}>+</button>
			</div>
		)

}

export default EdgeList