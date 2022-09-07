import { usePropsDBVertState } from "../../viewModel/Subscription_Manager.js"

import styles from "../Task.module.css"

export default function ResumeWork({id}){
	const [, setProps] = usePropsDBVertState(id)

	return <div className={styles.WithinContext}>
		<p>Getting back at it?</p>
		<button onClick={(e)=>setProps({"WorkStatus":2})}>Let's Go!</button>
	</div>
	
}