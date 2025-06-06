'use client';

import { useEffect } from 'react';
import { Hero, Features, Container, Section, Heading, Text, Button, Grid, Card, CardHeader, CardTitle, CardDescription } from '../src/components';
import { initTheme } from '../src/styles/design-system';
import landingContent from '../../content/copy/landing.json';

// Icons for features
const FeatureIcons = {
  automation: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  workflow: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  dashboard: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  assistant: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  integrations: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  analytics: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

const featureIconMap = [
  FeatureIcons.automation,
  FeatureIcons.workflow,
  FeatureIcons.dashboard,
  FeatureIcons.assistant,
  FeatureIcons.integrations,
  FeatureIcons.analytics,
];

export default function Home() {
  useEffect(() => {
    initTheme();
  }, []);

  const featuresWithIcons = landingContent.features.items.map((feature, index) => ({
    ...feature,
    icon: featureIconMap[index],
  }));

  // Override the secondary action to point to dashboard
  const heroWithDashboardLink = {
    ...landingContent.hero,
    secondaryAction: {
      label: "View Dashboard Demo",
      href: "/dashboard"
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <Hero
        badge={heroWithDashboardLink.badge}
        title={heroWithDashboardLink.title}
        subtitle={heroWithDashboardLink.subtitle}
        description={heroWithDashboardLink.description}
        primaryAction={heroWithDashboardLink.primaryAction}
        secondaryAction={heroWithDashboardLink.secondaryAction}
        align="center"
        variant="simple"
      />

      {/* Features Section */}
      <Features
        title={landingContent.features.title}
        subtitle={landingContent.features.subtitle}
        description={landingContent.features.description}
        features={featuresWithIcons}
        columns={3}
        variant="cards"
      />

      {/* Benefits Section */}
      <Section className="bg-background">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Heading as="h2">{landingContent.benefits.title}</Heading>
          </div>
          <Grid cols={3} gap="lg">
            {landingContent.benefits.items.map((benefit, index) => (
              <Card key={index} variant="elevated" hover>
                <CardHeader>
                  <CardTitle>{benefit.title}</CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-brand-600 to-brand-700 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <Heading as="h2" className="text-white mb-4">
              {landingContent.cta.title}
            </Heading>
            <Text variant="lead" className="text-white/90 mb-8">
              {landingContent.cta.description}
            </Text>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-brand-600 hover:bg-white/90"
            >
              {landingContent.cta.primaryAction.label}
            </Button>
            <Text variant="small" className="text-white/70 mt-4">
              {landingContent.cta.note}
            </Text>
          </div>
        </Container>
      </Section>
    </main>
  );
}
