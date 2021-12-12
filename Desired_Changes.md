# Model
- [~] Prevent duplicate titles?

- [x] Enforce unique IDs

- [~] Add LocalRoot nodes to section off sub-tasks
	- [~] Find ViewModel changes to support it

# ViewModel
- [x] `RelDBAddChild` returns the ID of the new child and connecting edge

- [x] Set a task back to `WorkStatus` 0 after beginning to work on it


- [~] Task-Task Edge 'Active' gets hard delete, not shown in UI
	- [~] Switch to an Enum-like for Active
	- [~] Add button and display details to View
	- [~] Change RelDBLookupOutE_Latest to comply
	- [~] Change useRelDBOutEState

- [x] `TreeDBHasUnmetDependencies` gives array of the blocking tasks
	- [x] Update JustifyUnmetDependencies to display titles

# View
- [x] Edit task titles


- [x] React reduce edge list if task is fully complete
	- Needs ported to new branch
	- [ ] Should I reduce the context buttons as well?

- [~] Scrollable Dependency Search

- [ ] Show all the parents of the task whose page we're visiting


# Back Burner

- [ ] `TreeDBTaskAbsolutelyImplied` gives array of what ancestors might block its' implication, and what roots it's implied by



- [ ] `TreeDBGetValidNewTaskDependencies` should instead take a label argument and give valid new dependencies with that label
	- Let's call it `TreeDBGetValidNewDependencies`


- [ ] Order listed dependencies by the number of tasks they block
