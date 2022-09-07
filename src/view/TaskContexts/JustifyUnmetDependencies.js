import { useTreeDBState } from "../../viewModel/Subscription_Manager.js"
import TaskTitle from "../TaskTitle.js"

import styles from "../Task.module.css"

export default function JustifyUnmetDependencies({id}){
	const [tree_props, ] = useTreeDBState(id)

	console.log(`${id} JustifyUnmetDependencies HasUnmetDependencies:`, tree_props.HasUnmetDependencies)

	if(Array.isArray(tree_props.HasUnmetDependencies) && tree_props.HasUnmetDependencies.length){
		return <div className={styles.WithinContext}>
			<div className={styles.Scroll}>
				{tree_props.HasUnmetDependencies.map((dep_id)=>{
					return <TaskTitle key={dep_id} id={dep_id} editable={false}/>
				})}
			</div>
		</div>
	} else {
		return <div className={styles.WithinContext}>
			<p>This task has no unmet Dependencies</p>
		</div>
	}
	
}