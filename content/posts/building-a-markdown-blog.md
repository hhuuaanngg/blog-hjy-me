---
title: "Building a Markdown Blog with Next.js"
date: "2026-03-10"
summary: "A practical walkthrough for structuring a production-ready Markdown blog with App Router and local content files."
category: "Engineering"
tags:
  - Next.js
  - Markdown
  - Architecture
cover: "/images/post-cover-1.svg"
draft: false
---

This project keeps content local so deployment stays simple and portable.

## Why local Markdown?

- Versioned together with code
- Easy to review in pull requests
- Works well with static generation

## Code example

```ts
export function getAllPosts() {
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
```

## Feature checklist

| Feature | Status |
| --- | --- |
| Homepage | Ready |
| Post detail | Ready |
| Tags | Ready |
| Comments | Placeholder |

With this approach, the blog works well on standard Node.js hosting and can also be containerized for Docker-based deployment.
