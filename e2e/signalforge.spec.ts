import { test, expect } from "@playwright/test";

test.describe("SignalForge End-to-End Suite", () => {
  test("Public Marketing Home page renders properly with brand positioning", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SignalForge/);
    await expect(page.locator("h1")).toContainText("Search intelligence for teams building durable visibility");
    await expect(page.locator("text=LIVE WORKSPACE MOCKUP")).toBeVisible();
    await expect(page.locator("text=SignalForge Authority (SFAI)")).toBeVisible();
  });

  test("Features and Security pages render with compliance pillars", async ({ page }) => {
    await page.goto("/features");
    await expect(page.locator("h1")).toContainText("Enterprise Search Intelligence Built for the Generative Era");

    await page.goto("/security");
    await expect(page.locator("h1")).toContainText("Enterprise Security, Ethical Crawling & Legal Compliance");
    await expect(page.locator("text=SignalForge Zero-Evasion Architecture")).toBeVisible();
  });

  test("App Shell Executive Overview loads with 4 core metrics", async ({ page }) => {
    await page.goto("/app/overview");
    await expect(page.locator("text=SignalForge Authority Index (SFAI)")).toBeVisible();
    await expect(page.locator("text=Discovery Velocity Score (DVS)")).toBeVisible();
    await expect(page.locator("text=AI Citation Share (AICS)")).toBeVisible();
    await expect(page.locator("text=Technical Health Quotient (THQ)")).toBeVisible();
    await expect(page.locator("text=apexcloud.io")).toBeVisible();
  });

  test("Keyword Intelligence table filters 320 monitored entities", async ({ page }) => {
    await page.goto("/app/projects/proj_apex_cloud/keywords");
    await expect(page.locator("h1")).toContainText("Keyword Intelligence & Positions");

    // Check table rows exist
    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(25); // Page 1 pageSize

    // Test search filter
    const searchInput = page.locator("input[placeholder*='Filter by term']");
    await searchInput.fill("kubernetes");
    await expect(page.locator("tbody")).toContainText("kubernetes");
  });

  test("Technical Site Audits view shows categorized issues and polite crawler", async ({ page }) => {
    await page.goto("/app/projects/proj_apex_cloud/audits");
    await expect(page.locator("h1")).toContainText("Technical Health Quotient (THQ) & Hygiene");
    await expect(page.locator("text=Categorized Issues")).toBeVisible();
    await expect(page.locator("text=Crawled Pages")).toBeVisible();
  });

  test("AI-Answer Visibility page renders generative engine monitoring", async ({ page }) => {
    await page.goto("/app/projects/proj_apex_cloud/ai-answers");
    await expect(page.locator("h1")).toContainText("AI-Answer Citation & Share of Voice");
    await expect(page.locator("text=Citation Win Rate")).toBeVisible();
  });
});
