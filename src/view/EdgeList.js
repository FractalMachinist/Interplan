import { useState, useEffect, useRef } from 'react'
import Task from "./Task.js"
import { useRelDBOutVState, usePropsDBEdgeState, useTreeDBState } from "../viewModel/Subscription_Manager.js"

import styles from "./EdgeList.module.css"
import common_styles from "./common.module.css"

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
					{ edgeProps.Active ? (<button className={[styles.EdgeButtonDisable].join(' ')} onClick={(e) => setEdgeProps({Active: false})}>-</button>) : null}
					{!edgeProps.Active ? (<button className={[styles.EdgeButtonEnable].join(' ')} onClick={(e) => setEdgeProps({Active:  true})}>+</button>) : null}
					{/*<button className={styles.EdgeButton} [onClick].join(' ')={() => forwardProps({status: 2})}>2</button>*/}
				</div>
				{typeof outboundVertID === 'string' ? <Task id={outboundVertID} locallyImplied={edgeProps.Active}/> : null}
			</div>



}


function EdgeList({ids, default_expand_EdgeList=false}) {
	const [GUI_Expanded, setGUI_Expanded] = useState(false);

	const scrollTo = useRef(null);

	useEffect(() => {
		setGUI_Expanded(default_expand_EdgeList);
	}, [default_expand_EdgeList])

	const ExpandEdgeList = (expanded)=>{
		setGUI_Expanded(expanded);
		if(expanded){
			setTimeout(_ => {scrollTo.current.scrollIntoView({behavior: "smooth", inline: "end"})}, 200)
		}
		

	}

	return <div ref={scrollTo} className={styles.ELMain}>
		<div className={styles.EdgeButtonDiv}>
			<button onClick={() => ExpandEdgeList(!GUI_Expanded)} className={GUI_Expanded ? styles.EdgeListHide_Button : styles.EdgeListShow_Button}>{GUI_Expanded ? `\u2304\n-\n-\n\u2303` : `\u2303\n-\n-\n\u2304`}</button>
		</div>
		<div className={GUI_Expanded ? styles.Expanded : styles.Retracted}>
			{GUI_Expanded ? ids.map(id => <Edge key={id} id={id}/>) : null}
		</div>
	</div>




}

export default EdgeList