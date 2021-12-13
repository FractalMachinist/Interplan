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
		return <div className={[styles.Title, props.LocalRoot ? styles.Highlight : null].join(' ')}>
			{editable && !minimized ? <button onClick={(e)=>{setEditing(true)}} className={styles.EditTitle}>:::</button> : null }
			<Link to={`/task/${id}`} className={styles.TitleLink}>
				{/* <p className={minimized ? styles.Minimized : editable ? styles.TitleTextEditable : styles.TitleText}>{title}</p> */}
				<h4 className={minimized ? styles.Minimized : (editable ? styles.TitleTextEditable : styles.TitleText)}>{title}</h4>
			</Link>
			{!minimized ? <button className={props.LocalRoot ? styles.LocalRootUnset : styles.LocalRootSet} onClick={(e)=>{setProps({"LocalRoot": !props.LocalRoot})}}>{props.LocalRoot ? `\u2605` : `\u2606`}</button> : null}
		</div>
	} else {
		return <div className={[styles.Title, props.LocalRoot ? styles.Highlight : null].join(' ')}>
			<button onClick={(e)=>{setEditing(false)}} className={styles.EditTitle}>:::</button>
			<input type="text" value={title} onChange={(e)=>{setTitle(e.target.value)}} onKeyDown={handleKeyDown} className={styles.TitleTextEdit}/>
			{!minimized ? <button className={props.LocalRoot ? styles.LocalRootUnset : styles.LocalRootSet} onClick={(e)=>{setProps({"LocalRoot": !props.LocalRoot})}}>{props.LocalRoot ? `\u2605` : `\u2606`}</button> : null}
		</div>
	}
}

export default TaskTitle