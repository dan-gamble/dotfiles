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

## Design Decisions

### 1. Unified Product Group Items Context
Will implement a strengthened ProductGroupItemsContext because:
- Provides single source of truth for product group item state
- Encapsulates all product selection and management logic
- Reduces duplication between routes
- Makes dependency relationships more maintainable

Trade-offs:
- More complex context implementation
- Need to handle both standalone and configuration-bound cases
- May need to refactor existing components to use new context

### 2. Separate State from UI
Will split product group management into distinct layers:
- Core state management (Context)
- UI components (Forms, Tables)
- Database operations (Models)

Because:
- Clearer separation of concerns
- Easier to test individual layers
- More flexible UI implementations
- Better type safety across layers

Trade-offs:
- More boilerplate initially
- Need to carefully design interfaces between layers
- May need to refactor existing UI components

### 3. Price Matrix Management
Will implement price management as a separate service because:
- Isolates complex price calculation logic
- Makes it easier to handle currency conversions
- Simplifies handling of dependent group price relationships
- Provides clear interface for UI components

Trade-offs:
- Additional abstraction layer
- Need to carefully handle state synchronization
- May impact performance with large price matrices

### 4. Product Selection Flow
Will standardize product selection through a unified picker service because:
- Consistent selection experience
- Reusable validation logic
- Centralized product/variant tracking
- Easier to maintain selected state

Trade-offs:
- Need to handle different selection contexts
- May need to modify existing selection flows
- Could impact performance with large product sets

## Technical Design

### 1. Core Components
```typescript
// Core ProductGroupItems Context
interface ProductGroupItemsContextValue {
   // State management
   state: ProductGroupItemsState
   dispatch: ProductGroupItemsDispatch
   // Product selection
   selectProducts: (groupId: string) => Promise<SelectedProducts>
   getSelectedProducts: (groupId: string) => SelectedProducts
   // Price management
   getPrices: (itemId: string, dependentItemId?: string) => Prices
   updatePrices: (itemId: strategiesng, prices: Prices) => void
}

// Price Management Service
interface PriceService {
   calculatePrices: (params: PriceCalculationParams) => Prices
   validatePrices: (prices: Prices) => ValidationResult
   convertCurrency: (amount: number, from: Currency, to: Currency) => number
}

// Product Selection Service
interface ProductSelectionService {
   openPicker: (config: PickerConfig) => Promise<SelectedProducts>
   validateSelection: (products: SelectedProducts) => ValidationResult
   trackSelectedState: (groupId: string, products: SelectedProducts) => void
}
```

```typescript
// Core types
type ProductGroupItem = {
   id: string
   productId: ShopifyGid<"Product">
   variantId: ShopifyGid<"ProductVariant">
   productGroupId: string
   prices: Record<CurrencyCode, Price[]>
}

type Price = {
   id: string
   amount: number
   currencyCode: CurrencyCode
   priceableType: "ProductGroupItem"
   priceableId: string
   dependentItemId?: string
}

type SelectedProduct = {
   selected: boolean
   productId: string
   variantId: string
   title: string
   variantTitle: string
   imageUrl?: string
}
```

### 3. Integration Points

1. Shopify Resource Picker
   - Integration via AppBridge
   - Product and variant selection
   - Image and metadata retrieval

2. Database Operations
   - Product group items CRUD
   - Price management
   - Dependency tracking

3. Form Integration
   - React Hook Form integration
   - Validation rules
   - State management

4. Component Integration

```typescript
// Example component integration
function ProductGroupItemsTable<T extends ProductGroupItem[]>({
   scope,
   productGroupId,
   dependentGroupId
}: Props) {
   const { getSelectedProducts, getPrices } = useProductGroupItems()
   // ... implementation
}
```

## Implementation Plan

### Phase 1: Core Context and Services
1. Enhanced ProductGroupItemsContext
   - Implement new context interface
   - Add state management for dependencies
   - Add price management utilities
   - Timeline: 1 week

2. Price Management Service
   - Implement price calculation logic
   - Add currency conversion support
   - Handle dependent item price matrices
   - Timeline: 1 week

3. Product Selection Service
   - Implement unified picker interface
   - Add validation logic
   - Handle state tracking
   - Timeline: 3-4 days

### Phase 2: UI Components and Integration
1. Shared Components
   - Refactor ProductGroupItemsTable
   - Create reusable price matrix component
   - Implement dependency visualization
   - Timeline: 1 week

2. Route Integration
   - Update global product groups route
   - Update made-to-order route
   - Unify selection flows
   - Timeline: 1 week

3. Form Handling
   - Implement unified validation
   - Add error handling
   - Update state management
   - Timeline: 3-4 days

### Phase 3: Testing and Refinement
1. Testing Implementation
   - Unit tests for core services
   - Integration tests for components
   - End-to-end flow testing
   - Timeline: 1 week

2. Performance Optimization
   - State management optimization
   - Price calculation caching
   - UI rendering improvements
   - Timeline: 3-4 days

3. Documentation and Clean-up
   - API documentation
   - Usage examples
   - Code cleanup
   - Timeline: 2-3 days
