import { useTreeDBState } from "../../viewModel/Subscription_Manager.js"
import TaskTitle from "../TaskTitle.js"

export default function JustifyUnmetDependencies({id}){
	const [tree_props, ] = useTreeDBState(id)

	console.log(`${id} JustifyUnmetDependencies HasUnmetDependencies:`, tree_props.HasUnmetDependencies)

	if(Array.isArray(tree_props.HasUnmetDependencies) && tree_props.HasUnmetDependencies.length){
		return <ul>
			{tree_props.HasUnmetDependencies.map((dep_id)=>{
				return <li key={dep_id}><TaskTitle id={dep_id} editable={false}/></li>
			})}
		</ul>
	} else {
		return <p>This task has no unmet Dependencies</p>
	}
	
}