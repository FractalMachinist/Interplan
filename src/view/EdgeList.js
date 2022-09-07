import { useState, useEffect, useRef } from 'react'
import Task from "./Task.js"
import { useRelDBOutVState, usePropsDBEdgeState, useTreeDBState } from "../viewModel/Subscription_Manager.js"

import styles from "./EdgeList.module.css"
import common_styles from "./common.module.css"

const confirmation_msg = `Permanently Disabling this constraint:
- Will permanently hide it from this User Interface
- Will permanently ignore this constraint
- Will mark this constraint Permanently Inactive in any Analytics UI

Are you sure you want to Permanently Disable this constraint?`;

function EdgeButtons({Active, setEdgeProps}){

	const permanently_disable_edge = (e) => {
		if(window.confirm(confirmation_msg)){
			setEdgeProps({Active: false, Deleted: true})
		}
	}

	if(Active){
		return <div className={styles.EdgeButtonDiv}>
			<button className={[styles.EdgeButtonDisable].join(' ')} onClick={(e) => setEdgeProps({Active: false})}>-</button>
		</div>
	} else {
		return <div className={styles.EdgeButtonDiv}>
			<button className={[styles.EdgeButtonEnable].join(' ')} onClick={(e) => setEdgeProps({Active: true})}>+</button>
			<button className={[styles.EdgeButtonDelete].join(' ')} onClick={(e) => permanently_disable_edge(e)}>X</button>
		</div>

	}
}


function Edge({id}) {
	const [outboundVertID, ] = useRelDBOutVState(id)
	const [edgeProps, setEdgeProps] = usePropsDBEdgeState(id)


	// if(typeof outboundVertID === 'string'){
		// console.debug(`${id} Edge with outboundVertID:`, outboundVertID)
	// }



	return <div className={edgeProps.Active ? styles.EdgeMain : styles.EdgeMain_Min}>
				{/*<p>Edge w/ ID {id}</p>*/}
				{/*{PropsElem}*/}
				<EdgeButtons Active={edgeProps.Active} setEdgeProps={setEdgeProps}/>
				{typeof outboundVertID === 'string' ? <Task id={outboundVertID} locallyImplied={(edgeProps.Active >= 1)}/> : null}
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
			<button onClick={() => ExpandEdgeList(!GUI_Expanded)} className={GUI_Expanded ? styles.EdgeListHide_Button : styles.EdgeListShow_Button}>
				{GUI_Expanded ? 
					<div className={styles.BAD}>{Array.from(`\n\u2304--\u2303`).map(char => <p className={styles.UGLY} >{char}</p>)}</div> :
					<div className={styles.BAD}>{Array.from(`\n\u2303--\u2304`).map(char => <p className={styles.UGLY} >{char}</p>)}</div>
					}
				</button>
		</div>
		<div className={GUI_Expanded ? (ids.length == 1 ? styles.Expanded_justOneChild : styles.Expanded) : styles.Retracted}>
			{GUI_Expanded ? ids.map(id => <Edge key={id} id={id}/>) : null}
		</div>
	</div>




}

export default EdgeList