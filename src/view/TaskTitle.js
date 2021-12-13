import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "./TaskTitle.module.css"
import { usePropsDBVertState } from "../viewModel/Subscription_Manager.js"

function TaskTitle({id, editable=true, minimized=false}) {
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
		return <div className={styles.Title}>
			{editable && !minimized ? <button onClick={(e)=>{setEditing(true)}} className={styles.EditTitle}>:::</button> : null }
			<Link to={`/task/${id}`} className={styles.TitleLink}>
				<p className={minimized ? styles.Minimized : editable ? styles.TitleTextEditable : styles.TitleText}>{title}</p>
			</Link>
		</div>
	} else {
		return <div className={styles.Title}>
			<button onClick={(e)=>{setEditing(false)}} className={styles.EditTitle}>:::</button>
			<input type="text" value={title} onChange={(e)=>{setTitle(e.target.value)}} onKeyDown={handleKeyDown} className={styles.TitleTextEdit}/>
		</div>
	}
}

export default TaskTitle