const uri = `bolt://${window.location.hostname}:30687`
const reverse_proxy_uri = `bolt://${window.location.hostname}:7687`
const user = "neo4j"
const password = "zach"

async function Startup_Guarantee_Constraints(tmp_driver){
	tmp_driver.session().run("CREATE CONSTRAINT unique_vert_id IF NOT EXISTS FOR (vert:IDSPACE) REQUIRE vert.id IS UNIQUE").then((result)=>{
	console.log("Constructed unique_vert_id constraint; response:", result)
})
}

var Driver = new Promise(resolve => {
	var neo4j_script = document.querySelector("#neo4j-driver");
	neo4j_script.addEventListener('load', () => {
		console.debug("Neo4J Driver Loaded")
		var tmp_driver = window.neo4j.driver(uri, window.neo4j.auth.basic(user, password))
		tmp_driver.verifyConnectivity().then((result)=>{
			// Successful Connection
			resolve(tmp_driver)
			Startup_Guarantee_Constraints(tmp_driver)
		}).catch((error)=>{
			// Try the reverse_proxy uri
			var rp_driver = window.neo4j.driver(reverse_proxy_uri, window.neo4j.auth.basic(user, password))
			rp_driver.verifyConnectivity().then((result)=>{
				resolve(rp_driver)
				Startup_Guarantee_Constraints(tmp_driver)
			})
		})
		
	})
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
	var intervalID = setInterval(update_fn, 10000);
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