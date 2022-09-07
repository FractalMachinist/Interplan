
# PropsDB

## Lookup

### FullLookup

- PropsDBLookup
	- *Hypothetical Analysis UI*

- PropsDBLookup_Latest
	- usePropsDBState
		- TaskContextWrapper.js
		- TaskContexts
		- TaskTitle.js
		- EdgeList.js

### SingleLookup

- PropsDBSingleLookup
	- *Hypothetical Analysis UI*

- PropsDBSingleLookup_Latest
	- TaskContexts
	- usePropsDBState
		- TaskContextWrapper.js
		- TaskContexts
		- TaskTitle.js
		- EdgeList.js

## Assign

- PropsDBAssign
	- TaskContexts
	- usePropsDBState
		- TaskContextWrapper.js
		- TaskContexts
		- TaskTitle.js
		- EdgeList.js

## Listeners

- PropsDBListenerFactory
	- usePropsDBState
		- TaskContextWrapper.js
		- TaskContexts
		- TaskTitle.js
		- EdgeList.js


# RelDB

## Lookup

- RelDBLookup
	- useRelDBState
		- Task.js
		- EdgeList.js

### Latest

- RelDBLookup_Latest
	- TreeDBHasUnmetDependencies (?)


## Assign

<!-- Maybe we fully delete RelDBAssign? Promote RelDBAddChild -->
- RelDBAssign 
	- useRelDBState
		- *NONE*
	- RelDBAddChild
		- *NONE*

- RelDBAddChild
	- TaskContexts

## Listeners

- RelDBListenerFactory
	- useRelDBState
		- Task.js
		- EdgeList.js


# TreeDB

## Lookup

- TreeDBCheckDependency
	- TreeDBTaskABsolutelyImplied
		- RootTask.js
		- TreeDBLookup
			- useTreeDBState
				- TaskContextWrapper.js
	- RelDBAssign
		- useRelDBState
			- *NONE*
		- RelDBAddChild
			- *NONE*

- TreeDBTaskAbsolutelyImplied
	- TreeDBCheckDependency (?)
	- RootTask.js
	- TreeDBLookup
		- useTreeDBState
			- TaskContextWrapper.js

- TreeDBHasUnmetDependencies
	- TreeDBLookup
		- useTreeDBState
			- TaskContextWrapper.js

- TreeDBGetValidNewDependencies
	- TaskContexts



- \_get_absolute_root
	- TreeDBTaskABsolutelyImplied
		- RootTask.js
		- TreeDBLookup
			- useTreeDBState
				- TaskContextWrapper.js

## Listener

- TreeDBListenerFactory
	- TaskContexts
	- useTreeDBState
		- TaskContextWrapper.js
