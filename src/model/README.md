# Interplan UI's Model
These modules define an Interplan-specific API for the ViewModel to interact with, and formats those interactions as Cypher quieries sent to the Neo4J databse. This API attempts to be database-agnostic, since Neo4J may not be able to support the particular use patterns Interplan requires.

## Neo4J_Backer
This file defines methods related to configuring and directly interacting with the Neo4J database, including password authentication and startup processes.

## Tree_M
These API methods query trees and paths between tasks, such as whether one task transitively depends on another. Throughout all of Interplan, these API methods would benefit most greatly from caching or a different database altogether.

## Rel_M
These API methods query and modify single-step relationships between tasks, such as getting a task's immediate dependencies, or validly creating a child without introducing circular dependencies. This validation means Rel_M depends on Tree_M for checking whether a dependency already exists from the parent to the child.

## Props_M & PropTools
These API methods expose and modify properties a vertex or an edge has based on its ID.
