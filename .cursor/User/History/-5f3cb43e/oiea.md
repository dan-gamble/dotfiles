```markdown
# [Feature Name] Design Document

## Current Context
- Brief overview of the existing system/feature
- Pain points or gaps being addressed
- Related features or dependencies

## Requirements

### Functional Requirements
- User-facing functionality
- Admin/merchant interactions
- Integration points with Shopify admin
- Data management requirements

### Non-Functional Requirements
- Performance expectations
- Scalability considerations
- Shopify API rate limits management
- Database query optimization needs

## Database Schema

### Drizzle Schema
```typescript
// database/schema/[feature].ts
import { text, integer, timestamp } from "drizzle-orm/sqlite-core";
import { createTable } from "~/database/utils";

export const featureTable = createTable("feature", {
  id: text("id").primaryKey(),
  shopId: text("shop_id").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
```

## GraphQL Operations

### Queries
```typescript
// graphql/FeatureQuery.ts
export const FeatureQuery = `#graphql
  query FeatureQuery($id: ID!) {
    feature(id: $id) {
      id
      title
      # Other fields
    }
  }
` as const;
```

### Mutations
```typescript
// graphql/FeatureMutation.ts
export const FeatureMutation = `#graphql
  mutation FeatureMutation($input: FeatureInput!) {
    featureCreate(input: $input) {
      feature {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;
```

## Models

### Server Models
```typescript
// models/Feature.server.ts
import type { Database } from "~/load-context/database";
import type { ShopifyGraphQLClient } from "~/load-context/shopify";
import { featureTable } from "~/database/schema/feature";

export async function getFeatures({
  db,
  sortKey,
  reverse,
  page,
  perPage,
  query,
}: {
  db: Database;
  sortKey?: string;
  reverse?: boolean;
  page?: number;
  perPage?: number;
  query?: string;
}) {
  // Implementation
}

export async function createFeature({
  data,
  db,
}: {
  data: FeatureData;
  db: Database;
}) {
  // Implementation
}
```

## Routes Structure

```typescript
// routes/app/feature/
├── _index.tsx           // List view
├── $id.tsx             // Detail view
├── components/         // Co-located components
│   ├── FeatureList.tsx
│   └── FeatureForm.tsx
├── types.ts           // Route-specific types
└── utils.ts           // Route-specific utilities
```

### Route Implementation
```typescript
// routes/app/feature/_index.tsx
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Page } from "@shopify/polaris";
import { FeatureList } from "./components/FeatureList";

export async function loader({ context }: LoaderFunctionArgs) {
  // Loader implementation
}

export default function FeatureIndex() {
  const { features } = useLoaderData<typeof loader>();
  
  return (
    <Page title="Features">
      <FeatureList features={features} />
    </Page>
  );
}
```

## Validators

```typescript
// validators/FeatureValidator.ts
import { withZod } from "@rvf/zod";
import { z } from "zod";

export const FeatureValidatorSchema = z.object({
  title: z.string().min(1),
  // Other validations
});

export const FeatureValidator = withZod(FeatureValidatorSchema);

export type FeatureValidator = z.infer<typeof FeatureValidatorSchema>;
```

## Components

### Layout Components
```typescript
// components/layouts/FeatureLayout.tsx
import { Frame, Layout } from "@shopify/polaris";

export function FeatureLayout({ children }: { children: React.ReactNode }) {
  return (
    <Frame>
      <Layout>
        {children}
      </Layout>
    </Frame>
  );
}
```

### Form Components
```typescript
// components/forms/FeatureForm.tsx
import { Form } from "@shopify/polaris";
import { useForm } from "@shopify/react-form";

export function FeatureForm() {
  // Form implementation
}
```

## Implementation Plan

### Phase 1: Core Implementation
1. Database schema setup
2. Basic CRUD operations
3. List and detail views
4. Form implementation

### Phase 2: Shopify Integration
1. GraphQL operations implementation
2. App Bridge integration
3. Webhook handlers (if needed)

### Phase 3: Enhancement
1. Advanced filtering
2. Bulk operations
3. Performance optimizations

## Technical Considerations

### Database
- Query optimization strategies
- Indexing requirements
- Batch operation patterns

### API
- Rate limiting considerations
- Error handling patterns
- Response caching strategy

### UI/UX
- Loading states
- Error states
- Success feedback
- Navigation patterns

## Security Considerations
- Data access controls
- Input validation
- CORS policies
- API authentication

## Dependencies

### Runtime Dependencies
- Shopify Admin API version requirements
- Polaris version
- App Bridge version

### Development Dependencies
- Drizzle
- Zod
- React Router
- TypeScript configuration

## Monitoring and Observability
- Key metrics to track
- Error tracking strategy
- Performance monitoring

## Rollout Strategy
1. Development phase
2. Testing in development store
3. Limited merchant testing
4. Full rollout

## References
- Relevant Shopify API documentation
- Related feature documentation
- Design system guidelines
```
