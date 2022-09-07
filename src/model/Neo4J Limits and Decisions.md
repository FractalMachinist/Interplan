# IdemProperties

## Limits
[Neo4j doesn't allow maps as properties (no sub-properties allowed, basically), and though lists are allowed as properties, they cannot be lists of maps (or lists of lists for that matter).](https://community.neo4j.com/t/cant-create-a-node-with-nested-sub-properties/1744/4)

## Decisions

### How do we store IdemProperties on Verts?
We don't. Normal properties.
<!-- #### Schema: 
(n:NeedsIdemProp)-[u:PropName]->(p1:IdemPropCarrier {id, timestamp: date, prop: value})-[u:PropName {id, disowned:false}]->(p2:IdemPropCarrier {id, timestamp: >date, prop: value2})

#### Retrieval:
match p=(n)-[:PropName\*]->(v)
return v
order by v.timestamp
limit 1

#### Mistake Correction:
match p=(n)-[:PropName\*]->(v), v-[u]->(e)
return v,u,e, COUNT(u)
where COUNT(u) > 1
ORDER BY v.id(), e.timestamp


### Edges
 -->

