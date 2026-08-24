import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

/**
 * DynamicHeadSEO
 * Dynamically synchronizes website metadata, document title,
 * browser tab icon (favicon), Apple touch icon, Open Graph preview,
 * Twitter card, and Google/Chrome Search structured data (JSON-LD)
 * with the uploaded logo and profile information.
 */
export const DynamicHeadSEO: React.FC = () => {
  const { profile, settings } = usePortfolio();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const brandLogo = profile.logoImage || settings.favicon || profile.profilePhoto;
    const authorName = profile.fullName || 'IRAKOZE Lionel Sabin';
    const professionalTitle = profile.specialty || profile.heroHeading || 'Full Stack Developer & AI Engineer';
    const pageTitle = `${authorName} | ${professionalTitle}`;
    const pageDescription = profile.bio || profile.heroIntro || 'Portfolio of IRAKOZE Lionel Sabin, Software Developer from Rwanda building cutting-edge web applications, mobile platforms, and AI-powered digital solutions.';

    // 1. Update Document Title
    document.title = pageTitle;

    // Helper to safely create or update meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to safely create or update link tag (e.g. favicon)
    const setLinkTag = (rel: string, href: string, type?: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
      if (type) {
        element.setAttribute('type', type);
      }
    };

    // 2. Update Standard SEO Meta Tags
    setMetaTag('name', 'description', pageDescription);
    setMetaTag('name', 'author', authorName);
    setMetaTag('name', 'keywords', `${authorName}, Lionel Sabin, Software Developer Rwanda, Full Stack Engineer, Web Developer Rwanda, AI Developer, Rwanda Tech`);
    setMetaTag('name', 'theme-color', '#060a17');

    // 3. Update Favicon & App Icons (Chrome tab icon, Apple touch, mobile home screen)
    if (brandLogo) {
      setLinkTag('icon', brandLogo, 'image/png');
      setLinkTag('shortcut icon', brandLogo, 'image/png');
      setLinkTag('apple-touch-icon', brandLogo);
    }

    // 4. Update Open Graph & Twitter Image (Used by Google Search, Chrome discovery, Social Sharing)
    const shareImage = brandLogo || profile.profilePhoto || '';
    if (shareImage) {
      setMetaTag('property', 'og:image', shareImage);
      setMetaTag('property', 'og:image:secure_url', shareImage);
      setMetaTag('name', 'twitter:image', shareImage);
      setMetaTag('name', 'twitter:card', 'summary_large_image');
    }

    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:type', 'profile');
    if (typeof window !== 'undefined') {
      setMetaTag('property', 'og:url', window.location.href);
    }

    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDescription);

    // 5. Inject / Update Schema.org JSON-LD Structured Data for Google/Chrome Search engine rich results
    try {
      const scriptId = 'ils-schema-structured-data';
      let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            '@id': typeof window !== 'undefined' ? `${window.location.origin}/#person` : 'https://lionelsabin.dev/#person',
            name: authorName,
            alternateName: ['Lionel Sabin', 'Lionel Sabin Irakoza', 'IRAKOZE Lionel Sabin'],
            jobTitle: professionalTitle,
            description: pageDescription,
            image: brandLogo || profile.profilePhoto || undefined,
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'RW',
              addressLocality: profile.location || 'Kigali, Rwanda'
            },
            email: profile.email || 'lionelsabin191@gmail.com',
            telephone: profile.whatsapp || undefined,
            sameAs: [
              'https://github.com',
              'https://linkedin.com'
            ]
          },
          {
            '@type': 'WebSite',
            '@id': typeof window !== 'undefined' ? `${window.location.origin}/#website` : 'https://lionelsabin.dev/#website',
            name: `${authorName} Official Portfolio`,
            url: typeof window !== 'undefined' ? window.location.origin : 'https://lionelsabin.dev',
            description: pageDescription,
            publisher: {
              '@type': 'Person',
              name: authorName,
              logo: brandLogo || undefined
            }
          }
        ]
      };

      scriptTag.textContent = JSON.stringify(structuredData);
    } catch (e) {
      console.warn('Could not inject structured data:', e);
    }
  }, [profile, settings]);

  return null;
};
