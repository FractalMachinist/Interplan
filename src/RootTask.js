import { useParams } from "react-router-dom";
import {  useState, useEffect } from 'react'
import Task from "./view/Task.js"

import style from "./RootTask.module.css"

import { TreeDBTaskAbsoluteImplied } from "./model/Tree_M.js"



function RootTask() {
	let {id} = useParams();
	const [rootIsImplied, setRootIsImplied] = useState(true)

	useEffect(() => 
		TreeDBTaskAbsoluteImplied(id).then(
			is_implied => {
				setRootIsImplied(is_implied);
			}
		), [id])

	return (
		<div className={style.RV}>
			<Task id={id} locallyImplied={rootIsImplied}/>
		</div>
	)
}

export default RootTask