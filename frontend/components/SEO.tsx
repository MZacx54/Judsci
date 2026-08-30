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
    title = 'JUDSCI Bauchi | Justice Development and Social Cohesion Initiative',
    description = 'Empowering communities across the Bauchi Diocese (Bauchi and Gombe States) through WASH, Peace Building, Sustainable Agriculture, Human Rights, and Empowerment.',
    name = 'JUDSCI Bauchi',
    type = 'website',
    image = 'https://www.judsci.org.ng/images/peace-building.jpg',
    url = 'https://www.judsci.org.ng/'
}) => {
    const formattedUrl = url.endsWith('/') ? url : `${url}/`;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={formattedUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={formattedUrl} />
            <meta property="og:site_name" content={name} />
            <meta property="og:locale" content="en_NG" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@jdpcbauchi" />
            <meta name="twitter:creator" content="@jdpcbauchi" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* GEO Meta Tags */}
            <meta name="geo.region" content="NG-BA" />
            <meta name="geo.placename" content="Bauchi, Nigeria" />
            <meta name="geo.position" content="10.3159;9.8442" />
            <meta name="ICBM" content="10.3159, 9.8442" />

            {/* Dynamic Article Structured Data */}
            {type === 'article' && (
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org",
                      "@type": "NewsArticle",
                      "headline": "${title.replace(/"/g, '\\"')}",
                      "image": ["${image}"],
                      "datePublished": "${new Date().toISOString()}",
                      "publisher": {
                        "@type": "NGO",
                        "name": "JUDSCI Bauchi",
                        "url": "https://www.judsci.org.ng",
                        "logo": {
                          "@type": "ImageObject",
                          "url": "https://www.judsci.org.ng/assets/logo.png"
                        }
                      },
                      "description": "${description.replace(/"/g, '\\"')}"
                    }
                    `}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
