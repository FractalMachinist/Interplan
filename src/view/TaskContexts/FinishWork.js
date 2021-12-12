import { usePropsDBVertState } from "../../viewModel/Subscription_Manager.js"

export default function FinishWork({id}){
	const [, setProps] = usePropsDBVertState(id)

	return <div>
		<p>How's it going?</p>
		<button onClick={(e)=>setProps({"WorkStatus":3})}>Done</button>
		<button onClick={(e)=>setProps({"WorkStatus":1})}>Taking a Break</button>
	</div>
	
}