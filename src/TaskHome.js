import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import TaskTitle from "./view/TaskTitle.js"

import styles from "./TaskHome.module.css"

import { TreeDBGetAllLocalRoot } from "./model/Tree_M.js"

export default function TaskHome(){
    const [localRoots, setLocalRoots] = useState([])

    useEffect(async () => {
        const LocalRoots = await TreeDBGetAllLocalRoot();
        console.log("TaskHome running TreeDBGetAllLocalRoot", LocalRoots)
        setLocalRoots(LocalRoots);
    }, [])

    return <div className={styles.TaskHome}>
        <h3 className={styles.header}>Here are some places to start:</h3>
        <div className={styles.Titles}>
            {localRoots.length ? localRoots.map(id => <TaskTitle key={id} id={id} editable={false}/>) : null}
        </div>
    </div>
}