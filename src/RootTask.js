import { useParams } from "react-router-dom";
import {  useState, useEffect } from 'react'
import Task from "./view/Task.js"

import style from "./RootTask.module.css"
import common_styles from "./view/common.module.css"

import { TreeDBTaskAbsoluteImplied } from "./model/Tree_M.js"



function RootTask() {
	let {id} = useParams();
	const [rootIsImplied, setRootIsImplied] = useState(true)

	console.log("RootTask Construction")

	useEffect(() => 
		TreeDBTaskAbsoluteImplied(id).then(
			is_implied => {
				setRootIsImplied(is_implied);
			}
		), [id])

	return (
		<div className={style.RV} id="RootTask">
			<Task id={id} locallyImplied={rootIsImplied} default_expand_EdgeList={true} setDocTitle={true} enforceHover={true}/>
		</div>
	)
}

export default RootTask