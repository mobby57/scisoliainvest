# Layout System - SCI Solia Invest

## Vue d'ensemble

Le système de layout combine plusieurs composants pour créer une interface utilisateur cohérente et responsive pour l'application SCI Solia Invest.

## Composants principaux

### MainLayout
Le layout principal qui combine la sidebar et la navigation top.

```tsx
import { MainLayout } from '@/components/Layout';

function MyPage() {
  return (
    <MainLayout title="Mon titre">
      <div>Contenu de la page</div>
    </MainLayout>
  );
}
```

### PageWrapper
Un wrapper qui standardise l'affichage des pages avec titre, sous-titre et actions.

```tsx
import { PageWrapper } from '@/components/Layout';
import { Plus } from 'lucide-react';

function MyPage() {
  return (
    <PageWrapper
      title="Mes projets"
      subtitle="Gérez vos investissements SCI"
      actions={
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau projet
        </button>
      }
    >
      <div>Contenu de la page</div>
    </PageWrapper>
  );
}
```

### Sidebar
Navigation latérale avec support du mode collapsed et responsive.

### TopNavigation
Barre de navigation supérieure avec recherche, notifications et menu utilisateur.

## Fonctionnalités

- **Responsive** : S'adapte automatiquement aux différentes tailles d'écran
- **Mode collapsed** : La sidebar peut être réduite sur desktop
- **Navigation mobile** : Menu hamburger et overlay sur mobile
- **Thème** : Support du mode sombre/clair
- **Notifications** : Système de notifications intégré
- **Recherche** : Barre de recherche globale

## Structure des fichiers

```
components/Layout/
├── MainLayout.tsx      # Layout principal
├── PageWrapper.tsx     # Wrapper de page standardisé
├── Sidebar.tsx         # Navigation latérale
├── ModernLayout.tsx    # Layout alternatif (legacy)
├── LayoutExample.tsx   # Exemple d'utilisation
├── index.ts           # Exports
└── README.md          # Documentation
```

## Utilisation recommandée

1. Utilisez `PageWrapper` pour la plupart des pages
2. Utilisez `MainLayout` directement pour des layouts personnalisés
3. Les composants sont optimisés pour TypeScript
4. Suivez les conventions de nommage des classes Tailwind CSS