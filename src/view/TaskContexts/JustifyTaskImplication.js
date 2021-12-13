import { useTreeDBState } from "../../viewModel/Subscription_Manager.js"

import styles from "./TCStyle.module.css"

export default function JustifyTaskImplication({id}){
	const [tree_props, ] = useTreeDBState(id)

	if(tree_props.AbsolutelyImplied){
		return <div className={styles.WithinContext}>
				<p>This task is Absolutely Implied!</p>
			</div>
	} else {
		return <div className={styles.WithinContext}>
				<p>This task is not implied by the Root.</p>
			</div>
	}
	
}