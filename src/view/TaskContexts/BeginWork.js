import { usePropsDBVertState } from "../../viewModel/Subscription_Manager.js"

export default function BeginWork({id}){
	const [, setProps] = usePropsDBVertState(id)

	return <div>
		<p>Ready to begin!</p>
		<button onClick={(e)=>setProps({"WorkStatus":2})}>Begin!</button>
	</div>
	
}