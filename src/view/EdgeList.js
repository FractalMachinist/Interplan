import { useState, useEffect } from 'react'
import Task from "./Task.js"
import { useRelDBOutVState, usePropsDBEdgeState, useTreeDBState } from "../viewModel/Subscription_Manager.js"

import styles from "./EdgeList.module.css"

function Edge({id}) {
	const [outboundVertID, ] = useRelDBOutVState(id)
	const [edgeProps, setEdgeProps] = usePropsDBEdgeState(id)


	// if(typeof outboundVertID === 'string'){
		// console.debug(`${id} Edge with outboundVertID:`, outboundVertID)
	// }

	return <div className={styles.EdgeMain}>
				{/*<p>Edge w/ ID {id}</p>*/}
				{/*{PropsElem}*/}
				<div className={styles.EdgeButtonDiv}>
					{ edgeProps.Active ? (<button className={styles.EdgeButton} onClick={(e) => setEdgeProps({Active: false})}>-</button>) : null}
					{!edgeProps.Active ? (<button className={styles.EdgeButton} onClick={(e) => setEdgeProps({Active:  true})}>+</button>) : null}
					{/*<button className={styles.EdgeButton} onClick={() => forwardProps({status: 2})}>2</button>*/}
				</div>
				{typeof outboundVertID === 'string' ? <Task id={outboundVertID} locallyImplied={edgeProps.Active}/> : null}
			</div>



}


function EdgeList({ids, default_expand_EdgeList=false}) {
	const [GUI_Expanded, setGUI_Expanded] = useState(false);

	useEffect(() => {
		setGUI_Expanded(default_expand_EdgeList)
	}, [default_expand_EdgeList])

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