import { useState, useEffect, useRef } from "react";

// import { useRelDBState, usePropsDBState, useDBConstructor } from "./Subscription_Manager.js"

import { PropsDBLookup_Latest, PropsDBAssign, PropsDBListenerFactory } from "../model/Props_M.js"
import { RelDBLookup, RelDBAssign, RelDBListenerFactory } from "../model/Rel_M.js"

import { TreeDBLookup, TreeDBListenerFactory } from "../model/Tree_M.js"

// I want to wrap RelDBState and PropsDBState in an interpreter
// which will convert them into the objects required for a Task state machine


// When do we recalculate our Task State?
//     When RelDBState or PropsDBState change
//     When TreeDBListener's fire
//     When our ID changes




//////////////////////////////////////////////


export function Task_DeriveStatus(props, tree){
	var Stati = []
	
	if(false && !props.ReviewersApproved){
		Stati.push("NeedsReviewerApproval")
	} else if(!props.Expanded){
		Stati.push("NeedsExpanded")
	} else if(!tree.AbsolutelyImplied){
		Stati.push("NotAbsImplied");
	} else if(tree.HasUnmetDependencies){
		Stati.push("HasUnmetDependencies")
	} else if(props.WorkStatus !== 2){
		Stati.push(props.WorkStatus ? "WorkInProgress" : "WorkWaiting")
	} else {
		Stati.push("_EndReviewStatus")
	}

	return Stati
}


