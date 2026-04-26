// @ts-nocheck - Test file for vitest (install vitest to run)
// Run: npx vitest run apps/web/modules/blog/lib/__tests__/process-content.test.ts
import { describe, it, expect } from "vitest";
import { processContent } from "../process-content";

describe("processContent XSS sanitization", () => {
  it("strips script tags", async () => {
    const { sanitizedHtml } = await processContent(
      '<p>Hello</p><script>alert("xss")</script>'
    );
    expect(sanitizedHtml).not.toContain("<script");
    expect(sanitizedHtml).not.toContain("alert");
  });

  it("strips onerror attributes", async () => {
    const { sanitizedHtml } = await processContent(
      '<img src="x" onerror="alert(1)" />'
    );
    expect(sanitizedHtml).not.toContain("onerror");
  });

  it("strips style attributes with javascript URLs", async () => {
    const { sanitizedHtml } = await processContent(
      '<p style="background:url(javascript:alert(1))">test</p>'
    );
    expect(sanitizedHtml).not.toContain("style=");
    expect(sanitizedHtml).not.toContain("javascript:");
  });

  it("blocks data: URLs in img src", async () => {
    const { sanitizedHtml } = await processContent(
      '<img src="data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+" />'
    );
    expect(sanitizedHtml).not.toContain("data:");
  });

  it("blocks javascript: URLs in href", async () => {
    const { sanitizedHtml } = await processContent(
      '<a href="javascript:alert(1)">click</a>'
    );
    expect(sanitizedHtml).not.toContain("javascript:");
  });

  it("blocks vbscript: URLs in href", async () => {
    const { sanitizedHtml } = await processContent(
      '<a href="vbscript:alert(1)">click</a>'
    );
    expect(sanitizedHtml).not.toContain("vbscript:");
  });

  it("strips iframe tags", async () => {
    const { sanitizedHtml } = await processContent(
      '<iframe src="https://evil.com"></iframe>'
    );
    expect(sanitizedHtml).not.toContain("<iframe");
  });

  it("strips svg tags", async () => {
    const { sanitizedHtml } = await processContent(
      '<svg onload="alert(1)"><circle r="50"/></svg>'
    );
    expect(sanitizedHtml).not.toContain("<svg");
  });

  it("strips object tags", async () => {
    const { sanitizedHtml } = await processContent(
      '<object data="malicious.swf"></object>'
    );
    expect(sanitizedHtml).not.toContain("<object");
  });

  it("strips embed tags", async () => {
    const { sanitizedHtml } = await processContent(
      '<embed src="malicious.swf" />'
    );
    expect(sanitizedHtml).not.toContain("<embed");
  });

  it("strips form tags", async () => {
    const { sanitizedHtml } = await processContent(
      '<form action="https://evil.com"><input type="text" /></form>'
    );
    expect(sanitizedHtml).not.toContain("<form");
    expect(sanitizedHtml).not.toContain("<input");
  });

  it("adds rel=noopener noreferrer ugc to external links", async () => {
    const { sanitizedHtml } = await processContent(
      '<a href="https://external.com">link</a>'
    );
    expect(sanitizedHtml).toContain('rel="noopener noreferrer ugc"');
    expect(sanitizedHtml).toContain('target="_blank"');
  });

  it("does not add target to internal links", async () => {
    const { sanitizedHtml } = await processContent(
      '<a href="/about">internal</a>'
    );
    expect(sanitizedHtml).not.toContain("target=");
  });

  it("filters unknown class values", async () => {
    const { sanitizedHtml } = await processContent(
      '<p class="lead evil-class">text</p>'
    );
    expect(sanitizedHtml).toContain('class="lead"');
    expect(sanitizedHtml).not.toContain("evil-class");
  });

  it("transforms div.callout to aside with proper classes", async () => {
    const { sanitizedHtml } = await processContent(
      '<div class="callout">content</div>'
    );
    expect(sanitizedHtml).toContain("<aside");
    expect(sanitizedHtml).toContain('role="note"');
    expect(sanitizedHtml).toContain("blog-card");
  });

  it("transforms div.rarity-card to figure", async () => {
    const { sanitizedHtml } = await processContent(
      '<div class="rarity-card">content</div>'
    );
    expect(sanitizedHtml).toContain("<figure");
  });

  it("transforms div.inline-cta to section", async () => {
    const { sanitizedHtml } = await processContent(
      '<div class="inline-cta">content</div>'
    );
    expect(sanitizedHtml).toContain("<section");
  });

  it("extracts headings for TOC", async () => {
    const { headings } = await processContent(
      "<h2>First</h2><p>text</p><h3>Sub</h3><h2>Second</h2>"
    );
    expect(headings).toHaveLength(3);
    expect(headings[0]).toMatchObject({ text: "First", level: 2 });
    expect(headings[1]).toMatchObject({ text: "Sub", level: 3 });
    expect(headings[2]).toMatchObject({ text: "Second", level: 2 });
  });

  it("calculates wordCount", async () => {
    const { wordCount } = await processContent(
      "<p>One two three four five.</p>"
    );
    expect(wordCount).toBe(5);
  });
});
