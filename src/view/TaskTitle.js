import { Link } from "react-router-dom"
import styles from "./TaskTitle.module.css"
import { usePropsDBState } from "../viewModel/Subscription_Manager.js"

function TaskTitle({id}) {
	const [props, setProps] = usePropsDBState(id)
	return <Link className={styles.VT} to={`/task/${id}`}>{props.Title}</Link>
}

export default TaskTitle