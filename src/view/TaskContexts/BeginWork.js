import { usePropsDBVertState } from "../../viewModel/Subscription_Manager.js"

import styles from "../Task.module.css"

export default function BeginWork({id}){
	const [, setProps] = usePropsDBVertState(id)

	return <div className={styles.WithinContext}>
		<p>Ready to begin!</p>
		<button onClick={(e)=>setProps({"WorkStatus":2})}>Begin!</button>
	</div>
	
}