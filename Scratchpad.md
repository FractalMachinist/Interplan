# What are all the states we're tracking?

{?Absolutely Implied}
{?Locally Implied}

{?Reviewers Approved}
{?Expanded}
{Waiting | Executing | Executed}

{Not Reviewed | Positive Review | Negative Review}
{var ReviewText}
{
	No Assigned Reviewers &
		{0 Incomplete Reviews & 0 Failed Reviews}

	| Reviewers Assigned & {
 		{>0 Incomplete Reviews | 0 Incomplete Reviews} &
		{>0 Failed Reviews | 0 Failed Reviews}
	}
}
{?Unmet Dependencies}


# What are all the Classes?

## Task
var ReviewersApproved = {?Approved}
var Expanded = {?Expanded}
var WorkStatus = {Waiting | Executing | Executed}
var Title

## (E) DependsOn
var Active = {?Active} <!-- An inactive (!Active) dependency is recorded for informational purposes, but is otherwise ignored -->
var LocalSequence <!-- A task's task dependencies need to be completed in LocalSequence order (High to Low, default 0), with ties completable concurrently -->

## Actor
var Title

## (E) Review
var Conclusion = {Not Reviewed | Positive Review | Negative Review}
var ReviewText

## Requirement
var Title



# What are some commonalities?

- All status changes are stored as idempotent transitions with timestamps
	- "At [timestamp], I updated the value to [value]"
		- This isn't enough to resolve race conditions, this needs rebuilt with a lot of thought
	- This includes a tool to retrieve the most recent status
	- Someday this should be migrated to point to the actor making the change as a logical relationship