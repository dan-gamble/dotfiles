# Product Group Items Management Design Document

## Current Context
- Two separate implementations for product group items:
  1. Global Product Groups (standalone, reusable)
  2. Made-to-Order Product Groups (configuration-bound, with dependencies)
- Initial attempt at unification via ProductGroupItemsContext
- Complex price matrix for dependent groups
- Separate UI flows for different contexts

### Pain Points
1. Duplicate logic between routes
2. Complex state management across contexts
3. Difficult to maintain dependency relationships
4. Price management complexity
5. Separate UI flows for similar operations

## Requirements

### Functional Requirements
1. Product Group Management
   - Create/edit global product groups
   - Create/edit configuration-bound groups
   - Manage dependencies between groups
   - Select products/variants from Shopify

2. Price Management
   - Set base prices for items
   - Handle N×N price matrix for dependent items
   - Support multiple currencies

3. State Management
   - Track selected products/variants
   - Maintain dependency relationships
   - Handle form state and validation

### Non-Functional Requirements
- Type safety across all operations
- Consistent UI/UX regardless of context
- Maintainable and testable code structure
- Clear separation of concerns
