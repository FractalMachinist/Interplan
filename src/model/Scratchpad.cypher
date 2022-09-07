// Neo4j claims to bring in predicate-like queries into variable length paths.
// https://github.com/neo4j/neo4j/issues/1961 (resolved)
// However, it seems to perform poorly.

// The one-liners find every path, then filter every relationship by Deleted and Active.
// The expanded forms below don't hit the DB for *every* Deleted and Active, only as many as it takes to find one which fails the test.
// Neither *appear* to stop extending the path after a disallowing match.

CYPHER
replan=force
profile 

MATCH (origin:IDSPACE), (valid:IDSPACE)
WHERE
valid.id <> origin.id 

// 1356073 total db hits in 2365 ms.
AND NOT exists((origin)-[:DependsOn {Deleted: false, Active: true}]->(valid))
AND NOT exists((valid)-[:DependsOn* {Deleted: false}]->(origin))


RETURN origin.id, collect(valid.id)





-------------------
// Grab *ALL* Unmet Dependencies for *ALL* tasks

// This is the structure used to pull a single set of Unmet Dependencies
// 4365633 total db hits in 4291 ms.
PROFILE MATCH (from)
OPTIONAL MATCH (from)-[:DependsOn* {Deleted: false, Active: true}]->(UnmetDependency:Task) 
WITH from, UnmetDependency
WHERE UnmetDependency.WorkStatus <> 3 
AND ALL(path IN (UnmetDependency)-[:DependsOn* {Deleted: false, Active: true}]->(:Task {WorkStatus: 3.0}) WHERE path IS NOT null) 
RETURN from.id, COLLECT(DISTINCT UnmetDependency.id) as UnmetDependencies


// This structure removes a cardinality restriction and effectively reuses the pool of UnmetDependency's
// across all the from's.
// 525625 total db hits in 663 ms.
PROFILE MATCH (from)
OPTIONAL MATCH (from)-[:DependsOn* {Deleted: false, Active: true}]->(UnmetDependency:Task) 
// WITH from, UnmetDependency
WHERE UnmetDependency.WorkStatus <> 3 
AND ALL(path IN (UnmetDependency)-[:DependsOn* {Deleted: false, Active: true}]->(:Task {WorkStatus: 3.0}) WHERE path IS NOT null) 
RETURN from.id, COLLECT(DISTINCT UnmetDependency.id) as UnmetDependencies