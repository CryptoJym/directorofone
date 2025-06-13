'use client';

import React from 'react';
import { HeroButton, HeroCard, HeroHeader, HeroAvatar, HeroStat } from '@h3ro-dev/ofone-ui';

export default function SharedComponentsDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <HeroHeader 
          title="Director of One"
          subtitle="Shared Components Showcase"
          variant="center"
        />
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Hero Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <HeroButton variant="primary">Primary Action</HeroButton>
            <HeroButton variant="secondary">Secondary Action</HeroButton>
            <HeroButton variant="outline">Outline Style</HeroButton>
            <HeroButton variant="ghost">Ghost Button</HeroButton>
            <HeroButton variant="destructive">Destructive</HeroButton>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Hero Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HeroCard 
              title="Strategic Planning"
              description="Execute comprehensive strategic initiatives with data-driven insights"
              ctaText="Plan Now"
            />
            <HeroCard 
              title="Team Leadership"
              description="Lead cross-functional teams with collaborative tools and real-time dashboards"
              ctaText="Lead Teams"
            />
            <HeroCard 
              title="Performance Analytics"
              description="Track KPIs and performance metrics with advanced analytics and reporting"
              ctaText="View Analytics"
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Hero Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <HeroStat 
              label="Projects Completed"
              value="142"
              trend={{ value: 12, isPositive: true }}
            />
            <HeroStat 
              label="Team Efficiency"
              value="94%"
              trend={{ value: 5, isPositive: true }}
            />
            <HeroStat 
              label="Budget Utilization"
              value="$2.4M"
              trend={{ value: 8, isPositive: false }}
            />
            <HeroStat 
              label="Client Satisfaction"
              value="4.9/5"
              trend={{ value: 0.3, isPositive: true }}
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Hero Avatars</h2>
          <div className="flex items-center gap-6">
            <HeroAvatar 
              name="Director User"
              imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Director"
              size="sm"
            />
            <HeroAvatar 
              name="Director User"
              imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Director"
              size="md"
            />
            <HeroAvatar 
              name="Director User"
              imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Director"
              size="lg"
            />
            <HeroAvatar 
              name="DU"
              size="lg"
            />
          </div>
        </section>

        <section className="text-center py-12">
          <HeroHeader 
            title="Ready to Transform Your Leadership?"
            subtitle="Leverage the power of unified components across your entire organization"
            variant="center"
          />
          <div className="mt-8">
            <HeroButton variant="primary" size="lg">
              Start Your Director Journey
            </HeroButton>
          </div>
        </section>
      </div>
    </div>
  );
}