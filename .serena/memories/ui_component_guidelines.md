---
name: UI Component Guidelines
description: How to use shadcn/ui and component libraries in this project
type: feedback
---

## Primary UI Library

**Always use shadcn/ui components**, not raw Tailwind CSS.

Per CLAUDE.md: "Jamais usar tailwind puro. usar sempre shadcn ui"

This means:
- Import from `@workspace/ui/components/`
- Use pre-built shadcn components
- Combine with Tailwind utilities as needed
- Do NOT write custom styled-only HTML with Tailwind classes

## Available Components (51+)

Common ones:
- Layout: Card, Sheet, Drawer, Dialog, Popover
- Forms: Input, Button, Label, Form, Checkbox, Select, Textarea, Switch
- Navigation: Tabs, Breadcrumb, Sidebar, NavigationMenu, DropdownMenu
- Data: Table, Pagination, Badge
- Feedback: Alert, Toast (Sonner), Tooltip, HoverCard
- Other: Avatar, Skeleton, Progress, Slider, Carousel, Calendar

Full list in README.md

## Usage Pattern

```tsx
// ✅ CORRECT: Use shadcn components
import { Button } from "@workspace/ui/components/button";
import { Card, CardHeader, CardContent, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Enter text..." />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}

// ❌ WRONG: Don't use raw Tailwind styling
export function BadComponent() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
      <h2 className="text-lg font-semibold">Title</h2>
      <div className="mt-4 border-t pt-4">
        <input className="w-full px-3 py-2 border border-gray-300 rounded" />
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          Submit
        </button>
      </div>
    </div>
  );
}
```

## Adding New Components

When you need a component that doesn't exist:

```bash
cd apps/web
pnpm dlx shadcn@latest add <component-name>
```

Examples: `pnpm dlx shadcn@latest add pagination`

Components are installed to `packages/ui/src/components/`

## Styling Strategy

Combine shadcn with Tailwind utilities:

```tsx
<Card className="p-8">
  <div className="space-y-4">
    {/* Uses Card's built-in styles + custom Tailwind spacing */}
  </div>
</Card>
```

## Form Components

Use shadcn Form with react-hook-form and Zod:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

const schema = z.object({
  name: z.string().min(1, "Required"),
});

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Class Merging

Use `cn()` utility for conditional classes:

```tsx
import { cn } from "@workspace/ui/lib/utils";

<Button className={cn(
  "base-classes",
  isActive && "active:classes",
  isDisabled && "disabled:classes"
)}>
  Click me
</Button>
```

## Theme & Appearance

- Default theme: Light mode with shadcn defaults
- Dark mode: Supported via `next-themes`
- Adapt theme variables if needed in app globals
