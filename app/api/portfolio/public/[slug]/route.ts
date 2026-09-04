/**
 * Portfolio API - Public Portfolio View
 * GET /api/portfolio/public/[slug]
 *
 * Gets a public portfolio by slug
 * No authentication required (public endpoint)
 * Increments view counter
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Validate slug format
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid portfolio slug' },
        { status: 400 }
      );
    }

    // Mock: Fetch public portfolio by slug
    const publicPortfolio = {
      profileSlug: slug,
      headline: 'Full Stack Developer | Problem Solver',
      bio: 'Passionate about building scalable applications.',
      location: 'Bangalore, India',
      experience: [
        {
          id: 'exp-1',
          title: 'Senior Developer',
          company: 'Tech Company',
          location: 'Bangalore',
          startDate: '2021-01',
          currentlyWorking: true,
          description: 'Led development of microservices architecture',
          skills: ['Node.js', 'React', 'Docker', 'AWS']
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University Name',
          degree: 'B.Tech',
          field: 'Computer Science',
          startDate: '2017-07',
          endDate: '2021-05',
          currentlyStudying: false
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon',
          issueDate: '2023-01-15'
        }
      ],
      skills: [
        { id: 'sk-1', name: 'JavaScript', endorsements: 45, category: 'technical' },
        { id: 'sk-2', name: 'React', endorsements: 38, category: 'technical' },
        { id: 'sk-3', name: 'Node.js', endorsements: 42, category: 'technical' }
      ],
      website: 'https://example.com',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      twitter: 'https://twitter.com/johndoe',
      careerFit: 'Software Developer',
      careerScore: 92,
      views: 142,
      lastUpdated: new Date().toISOString()
    };

    // TODO: Increment view counter in database
    // await db.updatePortfolioViews(slug);

    // Only return public fields
    const sanitized = {
      profileSlug: publicPortfolio.profileSlug,
      headline: publicPortfolio.headline,
      bio: publicPortfolio.bio,
      location: publicPortfolio.location,
      website: publicPortfolio.website,
      linkedin: publicPortfolio.linkedin,
      github: publicPortfolio.github,
      twitter: publicPortfolio.twitter,
      careerFit: publicPortfolio.careerFit,
      careerScore: publicPortfolio.careerScore,
      experience: publicPortfolio.experience,
      education: publicPortfolio.education,
      certifications: publicPortfolio.certifications,
      skills: publicPortfolio.skills,
      views: publicPortfolio.views,
      lastUpdated: publicPortfolio.lastUpdated
    };

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    return NextResponse.json(
      { error: 'Portfolio not found' },
      { status: 404 }
    );
  }
}
