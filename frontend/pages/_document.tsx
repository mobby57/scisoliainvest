import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta name="application-name" content="SCI Solia Invest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Solia Invest" />
        <meta name="description" content="Plateforme SaaS pour la gestion des investissements et des propriétés SCI" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2563eb" />

        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384x384.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-72x72.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://scisoliainvest.com" />
        <meta name="twitter:title" content="SCI Solia Invest" />
        <meta name="twitter:description" content="Plateforme SaaS pour la gestion des investissements et des propriétés SCI" />
        <meta name="twitter:image" content="https://scisoliainvest.com/icons/icon-192x192.png" />
        <meta name="twitter:creator" content="@scisoliainvest" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SCI Solia Invest" />
        <meta property="og:description" content="Plateforme SaaS pour la gestion des investissements et des propriétés SCI" />
        <meta property="og:site_name" content="SCI Solia Invest" />
        <meta property="og:url" content="https://scisoliainvest.com" />
        <meta property="og:image" content="https://scisoliainvest.com/icons/icon-192x192.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
