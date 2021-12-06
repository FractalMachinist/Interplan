import { useState, useEffect, useRef } from "react";

function _randomText(){
	return (Math.random() + 1).toString(36).substring(2)
}

function _randomBool(){
	return Math.random() > 0.5
}

function _randomWorkStatus(){
	// return Math.floor(Math.random()*3)
	return 0
}

function _randomReviewConclusion(){
	// -1, 0, 1 ==>> Fail, not complete, Pass
	// return Math.floor((Math.random()*3)-1)
	return 0
}

function _randomNTimestamps(num_timestamps){
	let diffs = [...Array(num_timestamps).keys()].map(num => Date.now() - Math.floor(Math.random()*1000));
	// diffs.sort();
	return diffs

}

function _randomHistory(_randomPropFn) {
	let num_steps = Math.floor(Math.random()*10) + 1
	return _randomNTimestamps(num_steps).map(timestamp => {return {timestamp: timestamp, prop: _randomPropFn()}})

}


const _fakeProps = {
	// ReviewersApproved: _randomBool,
	ReviewersApproved: ()=>{return false},
	// Expanded: _randomBool,
	Expanded: ()=>{return false},
	WorkStatus: _randomWorkStatus,
	Title: () => "Must " + _randomText(),
	//Active: _randomBool,
	Active: ()=>{return true},
	LocalSequence: () => Math.floor(Math.random()*10 - 3),
	Conclusion: _randomReviewConclusion,
	// ReviewText: _randomText
	ReviewText: ()=>'',
}

function _fake_novel_entry(){
	return Object.fromEntries(
		Object.entries(_fakeProps).map(
			([prop_name, rand_prop_fn]) => [prop_name, _randomHistory(rand_prop_fn)]
		)
	)
}

////////////////////////////////////

function LatestUpdate(prop_history){
	return prop_history.reduce((prev_latest, current_latest) => {
		return (current_latest.timestamp > prev_latest.timestamp) ? current_latest : prev_latest
	}, {timestamp: 0, prop: "FAILURE IN LatestUpdate"}).prop
}

export async function PropsDBLookup(id){
	const props_id = "props_" + id.toString();

	if(!window.localStorage.getItem(props_id)) {
		console.log("Generating some new history")
		window.localStorage.setItem(props_id, JSON.stringify(_fake_novel_entry()))
	}

	return JSON.parse(window.localStorage.getItem(props_id))
}

export async function PropsDBLookup_Latest(id){
	const prop_map = await PropsDBLookup(id);

	return Object.fromEntries(
		Object.entries(prop_map).map(
			([prop_name, prop_history]) => [prop_name, LatestUpdate(prop_history)]
		)
	)	
}



export async function PropsDBSingleLookup(id, prop_name){
	const prop_map = await PropsDBLookup(id);
	return prop_map[prop_name]
}

export async function PropsDBSingleLookup_Latest(id, prop_name){
	const prop_map = await PropsDBLookup_Latest(id);
	return prop_map[prop_name]
}



export async function PropsDBAssign(id, new_props){
	// console.log("fake DB assign props", id, new_props)
	const props_id = "props_" + id.toString();
	var records = await PropsDBLookup(id);

	// console.log("PropsDBAssign records:", records)

	const now = Date.now()

	const new_records = Object.fromEntries(Object.entries(new_props).map(([prop_name, new_entry]) => {
		return [prop_name, {timestamp: now, prop: new_entry}]
	}))

	Object.entries(new_records).map(([prop_name, new_record]) => {
		// console.log("DB Prop Assign on name", prop_name)
		records[prop_name].push(new_record)
		return null
	})

	window.localStorage.setItem(props_id, JSON.stringify(records))

	// Construct an event to trigger redraws on this same page
	const event = new CustomEvent(`interplan_PropsDB_Update`, {detail: {key: id, delta:new_records}})
	document.dispatchEvent(event)
}




/////////// Should these be a part of the Model, or the ViewModel?


function _standardize_events_wrapper(wrapped){
	return (e) => {

		const _from_storage = "key" in e
		var change_notice;

		if("detail" in e){
			// It's a custom notification
			change_notice = e.detail
		} else {
			// It's (probably) a storage notification
			change_notice = {
				key: e.key,
				newValue: e.newValue,
				oldValue: e.oldValue
			}
		}

		return wrapped(change_notice)

	}
}

function _fake_db_listener_factory(ID, update_fn){

	return () => {
		// console.log("Fake PropsDB Listener fac-prod running update fn", update_fn)

		var wrapped_update_fn = _standardize_events_wrapper(update_fn);
		var update_phrase = `interplan_PropsDB_Update`

		window.addEventListener('storage', wrapped_update_fn)
		document.addEventListener(update_phrase, wrapped_update_fn)


		return () => {
			console.log("CLEANING EVENT LISTENERS")
			window.removeEventListener("storage", wrapped_update_fn);
			document.removeEventListener(update_phrase, wrapped_update_fn);
		}
	}
}

export function PropsDBListenerFactory(ID, update_fn) {
	return _fake_db_listener_factory(ID, update_fn)

}