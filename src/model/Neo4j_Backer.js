const uri = `bolt://${window.location.hostname}:31687`
// const reverse_proxy_uri = `bolt://${window.location.hostname}:7687`


const user = "neo4j"

const get_password = async (prompt="DB Password:") => {
	var password = window.localStorage.getItem("INTERPLAN_PASS");
	var pass_from_storage = true;
	if(password === null){
		password = await window.prompt(prompt)
		pass_from_storage = false;
	}
	return [password, pass_from_storage]
}

const store_password = async (password) => {
	window.localStorage.setItem("INTERPLAN_PASS", password)
}

const clear_password = async () => {
	window.localStorage.removeItem("INTERPLAN_PASS")
}

async function Startup_Guarantee_Constraints(tmp_driver){
	tmp_driver.session().run("CREATE CONSTRAINT unique_vert_id IF NOT EXISTS FOR (vert:IDSPACE) REQUIRE vert.id IS UNIQUE").then((result)=>{
		console.log("Constructed unique_vert_id constraint; response:", result)
	})

	tmp_driver.session().run("CREATE CONSTRAINT unique_task_title IF NOT EXISTS FOR (vert:Task) REQUIRE vert.Title IS UNIQUE").then((result)=>{
		console.log("Constructed unique_task_title constraint; response:", result)
	})

	// tmp_driver.session().run(`MERGE (n:Task:IDSPACE {WorkStatus:0.0, LocalRoot:true, AbsoluteRoot:true, id:"ROOT", Expanded:false})`).then((result)=>{
	// 	console.log("Ensured Root exists; response:", result);
	// })
}

const get_driver = async (resolve, retry_on_failure=true) => {
	console.debug("Neo4J Driver Loaded")
	const [pass, pass_from_storage] = await get_password(retry_on_failure ? undefined:"Stored password failed\nDB Password:");
	var tmp_driver = window.neo4j.driver(uri, window.neo4j.auth.basic(user, pass))
	tmp_driver.verifyConnectivity().then((result)=>{
		// Successful Connection
		resolve(tmp_driver)
		store_password(pass)
		Startup_Guarantee_Constraints(tmp_driver)
	}).catch((error)=>{
		if(pass_from_storage && retry_on_failure){
			// It's possible the stored password was wrong
			// Arrange to get a new password and try again
			clear_password();
			console.log("Recursing Driver")
			return get_driver(resolve, false);
		} else {
			// We can get here by:
			//     - Failing to authenticate from a fresh password
			//     - Trying a stored password, failing, and failing on a fresh password
			// The page shouldn't continue loading, and might throw errors
			console.error("Default neo4j uri failed", error, error.code)
			console.log(Object.entries(error))
			window.alert(`Neo4j Driver failed on given URI: ${uri}`)
			clear_password();
			throw "Default neo4j uri failed"
		}

		
	})
}

var Driver = new Promise(resolve => {
	var neo4j_script = document.querySelector("#neo4j-driver");
	neo4j_script.addEventListener('load', () => get_driver(resolve));
});




export async function Transaction(query, call_sign, payload={}, Read_else_Write = "Read", auto_strip=true, auto_strip_collect_by_key, auto_strip_permit_singleton){
	var session = (await Driver).session()

	var transaction_handler = Read_else_Write === "Read" ? session.readTransaction.bind(session) : session.writeTransaction.bind(session)

	return transaction_handler(tx => {
		return tx.run(query, payload)
	}).then(result => {

		

		if(Read_else_Write === "Read" && result.records.length === 0){
			// We tried to read and got nothing
			console.error(`${call_sign} Read Transaction gave zero results. Ensure downstream is prepared to receive [].`)
			return result
		}

		// console.debug(`${call_sign} approved this result:`, result.records)
		var finished;
		if(auto_strip){
			finished = strip_results(result, auto_strip_collect_by_key, auto_strip_permit_singleton)
		}

		if(Array.isArray(finished) && finished.length > 1){
			console.log({records: result.records.length, finished: finished.length, call_sign: call_sign, Query: query})
		}

		return finished

	}).catch(error => {
		const message = `${call_sign} Failed during ${Read_else_Write} Transaction - ${error}`
		console.error(message)
		window.alert(message)
		throw error

	}).finally(()=>{
		session.close()
	})
}


export function DB_Listener_Factory(update_fn){
	var intervalID = setInterval(update_fn, 30000);
	return ()=>{
		clearInterval(intervalID)
	}

}

const transpose = m => m[0].map((x,i) => m.map(x => x[i]))


export function strip_results(result, collect_by_key=true, permit_singleton=true){
    // Result = Result.Records[Record.get(key)]
    var stripped = result.records.map((record)=>{
    	// We order the keys so that the values have a stable order
        return record.keys.sort().map(record.get.bind(record))
    })
    // stripped = [[value_r1_k1, value_r1_k2, ...], [value_r2_k1, ...], ...]

    if(collect_by_key){
        stripped = transpose(stripped)
        // stripped = [[value_r1_k1, value_r2_k1, ...], [value_r1_k2, value_r2_k2, ...], ...]
    }


    if(permit_singleton){
        if(stripped.length === 1){ // If there was only one (collect_by_key ? key : record), get it on it's own
            stripped=stripped[0]
        }

        if(stripped.length === 1){ // If there was only one key *and* only one record, get it on it's own
            stripped=stripped[0]
        }
    }

    return stripped
}





/*
# Run at Startup:
CINE unique label
- CREATE CONSTRAINT constraint_name IF NOT EXISTS FOR (book:Book) REQUIRE book.isbn IS UNIQUE

*/