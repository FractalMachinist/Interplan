import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "./TaskTitle.module.css"
import { usePropsDBVertState } from "../viewModel/Subscription_Manager.js"

function TaskTitle({id, editable=true}) {
	const [props, setProps] = usePropsDBVertState(id)
	const [title, setTitle] = useState("")
	const [editing, setEditing] = useState(false)

	useEffect(() => {
		setTitle(props.Title)
	}, [props])


	const handleKeyDown = (e) => {
		if (e.key === 'Enter'){
			setProps({Title: title})
			setEditing(false)
		}
	}


	if(!editing){
		return <div>
			{editable ? <button onClick={(e)=>{setEditing(true)}}>...</button> : null }
			<Link className={styles.VT} to={`/task/${id}`}>{title}</Link>
		</div>
	} else {
		return <div>
			<button onClick={(e)=>{setEditing(false)}}>...</button>
			<input type="text" value={title || "..."} onChange={(e)=>{setTitle(e.target.value)}} onKeyDown={handleKeyDown}/>
		</div>
	}
}

export default TaskTitle