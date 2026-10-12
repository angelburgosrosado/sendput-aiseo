import { PrismaClient } from "@prisma/client";
import {
  demoOrganizations,
  demoUsers,
  demoProjects,
  demoCompetitors,
  demoKeywords,
  demoRankingObservations,
  demoCrawlPages,
  demoAuditIssues,
  demoContentBriefs,
  demoAIObservations,
  demoLocalLocations,
} from "../lib/demo-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SignalForge database seed...");

  // 1. Subscription Plans
  const plans = [
    { id: "plan_starter", name: "SignalForge Starter", tier: "STARTER", maxProjects: 3, maxKeywords: 500, maxCrawlPages: 2000, maxAIQueries: 50, priceMonthly: 99 },
    { id: "plan_growth", name: "SignalForge Growth", tier: "GROWTH", maxProjects: 10, maxKeywords: 2500, maxCrawlPages: 15000, maxAIQueries: 250, priceMonthly: 249 },
    { id: "plan_enterprise", name: "SignalForge Enterprise", tier: "ENTERPRISE", maxProjects: 50, maxKeywords: 15000, maxCrawlPages: 100000, maxAIQueries: 2000, priceMonthly: 699 },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { tier: plan.tier },
      update: plan,
      create: plan,
    });
  }

  // 2. Organizations
  for (const org of demoOrganizations) {
    await prisma.organization.upsert({
      where: { slug: org.slug },
      update: { name: org.name, subscriptionTier: org.tier },
      create: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        subscriptionTier: org.tier,
      },
    });
  }

  // 3. Users & Memberships
  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, jobTitle: user.jobTitle, avatarUrl: user.avatar },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        jobTitle: user.jobTitle,
        avatarUrl: user.avatar,
      },
    });

    // Create membership in primary org (org_apex)
    await prisma.membership.upsert({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: "org_apex",
        },
      },
      update: { role: user.role as any },
      create: {
        userId: user.id,
        organizationId: "org_apex",
        role: user.role as any,
      },
    });
  }

  // 4. Projects & Properties
  for (const proj of demoProjects) {
    await prisma.project.upsert({
      where: { id: proj.id },
      update: {
        name: proj.name,
        domain: proj.domain,
        description: proj.description,
        sfaiScore: proj.sfaiScore,
        discoveryVelocity: proj.discoveryVelocity,
        healthQuotient: proj.healthQuotient,
        aiCitationShare: proj.aiCitationShare,
      },
      create: {
        id: proj.id,
        organizationId: proj.orgId,
        name: proj.name,
        domain: proj.domain,
        description: proj.description,
        targetCountry: proj.targetCountry,
        sfaiScore: proj.sfaiScore,
        discoveryVelocity: proj.discoveryVelocity,
        healthQuotient: proj.healthQuotient,
        aiCitationShare: proj.aiCitationShare,
      },
    });

    await prisma.websiteProperty.create({
      data: {
        projectId: proj.id,
        url: `https://${proj.domain}`,
        verificationType: "DNS_TXT",
        status: "VERIFIED",
      },
    });
  }

  // 5. Competitors
  for (const comp of demoCompetitors) {
    await prisma.competitor.create({
      data: {
        id: comp.id,
        projectId: comp.projectId,
        name: comp.name,
        domain: comp.domain,
        sfaiScore: comp.sfaiScore,
        commonKeywords: comp.commonKeywords,
        overlapShare: comp.overlapShare,
        organicBreadth: comp.organicBreadth,
      },
    });
  }

  // 6. Keywords
  for (const kw of demoKeywords) {
    await prisma.keyword.create({
      data: {
        id: kw.id,
        projectId: kw.projectId,
        term: kw.term,
        searchVolume: kw.searchVolume,
        difficultyScore: kw.difficultyScore,
        cpc: kw.cpc,
        intent: kw.intent as any,
        currentPosition: kw.currentPosition,
        previousPosition: kw.previousPosition,
        bestPosition: kw.bestPosition,
        serpFeatures: JSON.stringify(kw.serpFeatures),
        tags: JSON.stringify(kw.tags),
        isSynthetic: true,
      },
    });
  }

  console.log(`✅ Seeded ${demoKeywords.length} keywords.`);

  // 7. Site Audit Run & Issues
  for (const proj of demoProjects) {
    const run = await prisma.siteAuditRun.create({
      data: {
        projectId: proj.id,
        status: "COMPLETED",
        pagesCrawled: 45,
        healthScore: proj.healthQuotient,
        criticalCount: 4,
        highCount: 12,
        mediumCount: 22,
        lowCount: 18,
      },
    });

    // Seed crawl pages
    const projectPages = demoCrawlPages.filter((p) => p.projectId === proj.id);
    for (const page of projectPages) {
      await prisma.crawlPage.create({
        data: {
          siteAuditRunId: run.id,
          url: page.url,
          statusCode: page.statusCode,
          title: page.title,
          h1: page.h1,
          wordCount: page.wordCount,
          loadTimeMs: page.loadTimeMs,
          metaRobots: page.metaRobots,
          canonicalUrl: page.canonicalUrl,
          hasSsl: page.hasSsl,
        },
      });
    }

    // Seed audit issues
    const projectIssues = demoAuditIssues.filter((i) => i.projectId === proj.id);
    for (const issue of projectIssues) {
      await prisma.siteAuditIssue.create({
        data: {
          siteAuditRunId: run.id,
          pageUrl: issue.pageUrl,
          issueType: issue.issueType,
          severity: issue.severity as any,
          message: issue.message,
          recommendation: issue.recommendation,
          status: issue.status,
        },
      });
    }
  }

  // 8. Content Briefs
  for (const brief of demoContentBriefs) {
    await prisma.contentBrief.create({
      data: {
        id: brief.id,
        projectId: brief.projectId,
        title: brief.title,
        targetKeyword: brief.targetKeyword,
        targetAudience: brief.targetAudience,
        status: brief.status as any,
        qualityScore: brief.qualityScore,
        wordCountGoal: brief.wordCountGoal,
        briefOutline: JSON.stringify(brief.outline),
      },
    });
  }

  // 9. AI Queries & Observations
  for (const obs of demoAIObservations) {
    const aiQuery = await prisma.aiQuery.create({
      data: {
        projectId: obs.projectId,
        queryPrompt: obs.prompt,
        engine: obs.engine as any,
        frequencyDays: 7,
      },
    });

    await prisma.aiVisibilityObservation.create({
      data: {
        aiQueryId: aiQuery.id,
        engine: obs.engine as any,
        mentionType: obs.mentionType as any,
        citationRank: obs.citationRank,
        isClientCited: obs.isClientCited,
        citedSourceUrl: obs.citedSourceUrl,
        sentimentScore: obs.sentimentScore,
        snippetContext: obs.snippetContext,
        isSynthetic: true,
      },
    });
  }

  // 10. Local Locations
  for (const loc of demoLocalLocations) {
    const location = await prisma.localLocation.create({
      data: {
        id: loc.id,
        projectId: loc.projectId,
        businessName: loc.businessName,
        address: loc.address,
        city: loc.city,
        state: loc.state,
        postalCode: loc.postalCode,
        phone: loc.phone,
      },
    });

    for (const plat of loc.platforms) {
      await prisma.localListingStatus.create({
        data: {
          localLocationId: location.id,
          platform: plat.name,
          status: plat.status,
          rating: plat.rating,
          reviewsCount: plat.reviews,
          napConsistency: loc.accuracyScore,
        },
      });
    }
  }

  console.log("🚀 SignalForge database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed execution note:", e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
