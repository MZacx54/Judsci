import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    name?: string;
    type?: string;
    image?: string;
    url?: string;
}

const SEO: React.FC<SEOProps> = ({
    title = 'JUDSCI Bauchi - Justice Development and Social Cohesion Initiative',
    description = 'Empressing communities in the Bauchi and Gombe states through WASH, human rights advocacy, and sustainable development. Managed by JDPC Bauchi.',
    name = 'JUDSCI Bauchi',
    type = 'website',
    image = 'https://judsci.org.ng/assets/logo-dg6AA_Hm.png',
    url = 'https://judsci.org.ng'
}) => {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Open Graph tags for Facebook / LinkedIn / WhatsApp */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content={name} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured data */}
            {type === 'article' && (
                <script type="application/ld+json">
                    {`
            {
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "headline": "${title}",
              "image": [
                "${image}"
               ],
              "datePublished": "${new Date().toISOString()}",
              "author": [{
                  "@type": "Organization",
                  "name": "JUDSCI Bauchi",
                  "url": "https://judsci.org.ng"
                }]
            }
          `}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
