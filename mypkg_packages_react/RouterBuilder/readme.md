# Comment Utiliser `RouteBuilder` et `LinkBuilder`

## 1. Vue d’Ensemble

`RouteBuilder` permet de créer un `BrowserRouter` typé à partir d’un schéma de routes.
`LinkBuilder` génère des composants `<Link>` et `<NavLink>` liés à ce schéma, garantissant la sécurité des types et une navigation simplifiée.

---

## 2. Définir vos Routes

```tsx
// Routes.tsx
import { type RouteSchema, RouteBuilder, LinkBuilder } from "../../mypkg_packages_react/RouterBuilder/RouteBuilder.tsx";
import { HomeElement, AboutElement, NoRouteElement, RootLayout } from "../Pages/Pages.tsx";
import type { RouteObject } from "react-router-dom";

// Routes individuelles
// Chaque constante représente une page et sa configuration dans le routeur.
const HomeRoute: RouteObject = { path: "/", element: <HomeElement />, index: true }; // Page d'accueil (index)
const AboutRoute: RouteObject = { path: "/about", element: <AboutElement /> }; // Page "À propos"
const NoRoute: RouteObject = { path: "*", element: <NoRouteElement /> }; // Page 404 pour les routes non trouvées
const RootRoute: RouteObject = {
  path: "/",
  element: <RootLayout />, // Layout global
  errorElement: <NoRouteElement />, // Page d'erreur globale
  children: [HomeRoute, AboutRoute] // Routes enfants intégrées au layout
};

// Schéma pour RouteBuilder
// On associe un nom de route (clé) à un objet RouteObject.
type RouteName = "root" | "noroute";
const RouteSchema: RouteSchema<RouteName> = {
  root: RootRoute,
  noroute: NoRoute
};
export const R = new RouteBuilder(RouteSchema); // Instance pour créer le routeur

// Schéma pour LinkBuilder
// Sert à générer des liens typés vers ces routes.
type LinkName = "home" | "about" | "noroute";
const LinkSchema: RouteSchema<LinkName> = {
  home: HomeRoute,
  about: AboutRoute,
  noroute: NoRoute
};
export const L = new LinkBuilder(LinkSchema); // Instance pour générer des <Link> et <NavLink>
```

---

## 3. Utiliser dans votre Application

```tsx
// App.tsx
import { R } from "./Routes/Routes.tsx";
import { RouterProvider } from "react-router-dom";

export default function App() {
  // On crée un RouterProvider avec uniquement les routes souhaitées (ici, "root")
  return <RouterProvider router={R.router(["root", "noroute"])}/>;
}
```

Le `<Outlet>` agit comme un point d’insertion : dans un layout parent, il affiche automatiquement le composant associé à la route enfant active.

```tsx
// RootLayout.tsx
import { Outlet } from "react-router-dom";
import { MenuLayout, StyleMenuLeft } from "../../mypkg_packages_react/Components/Index.ts";
import { NavigationMenu } from "../Menu/nav.tsx";
import { MenuTogglerIcon } from "../Menu/toggler.tsx";

export function RootLayout() {
    return (
        <MenuLayout
            content={<NavigationMenu />} // Menu latéral
            styles={StyleMenuLeft}        // Styles appliqués au menu
            toggler={MenuTogglerIcon()}   // Bouton de toggling du menu
        >
            {/* Les routes enfants (home, about, etc.) seront rendues ici */}
            <Outlet />
        </MenuLayout>
    );
}
```

---

## 4. Créer des Liens de Navigation

Avec `LinkBuilder`, vous référencez les routes par nom au lieu de coder en dur les chemins.

```tsx
// NavigationMenu.tsx
import { L } from '../Routes/Routes.tsx';

export function NavigationMenu() {
    // Classes CSS communes à tous les liens
    const linkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    // Classe pour un lien actif
    const activeLinkClasses = "bg-gray-900 text-white";
    // Classe pour un lien inactif
    const inactiveLinkClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex items-center space-x-4">
                <li>
                    {/* L.NavLink crée un lien typé vers la route "home" */}
                    <L.NavLink
                        routeName="home"
                        className={({ isActive }) =>
                            `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
                        }
                    >
                        Accueil
                    </L.NavLink>
                </li>
                <li>
                    {/* L.NavLink crée un lien typé vers la route "about" */}
                    <L.NavLink
                        routeName="about"
                        className={({ isActive }) =>
                            `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
                        }
                    >
                        À Propos
                    </L.NavLink>
                </li>
            </ul>
        </nav>
    );
}
```

---

## 5. Avantages Clés

* **Sécurité de type** : les noms et paramètres de route sont vérifiés à la compilation.
* **Configuration centralisée** : toutes les définitions de routes dans un seul schéma.
* **Facilité de refactorisation** : modifier un chemin se fait dans un seul fichier.
* **Moins de répétition** : pas de chaînes de chemins en double dans le code.

---

## 6. Méthodes Utiles

* `R.router(["root"])` → crée un routeur avec certaines routes.
* `R.routerAll()` → crée un routeur avec toutes les routes.
* `L.Link` → composant `<Link>` typé.
* `L.NavLink` → composant `<NavLink>` typé.
* `L.path("about")` → retourne le chemin d’une route.

---

**Flux de projet recommandé :**

1. Définir les routes (`RouteSchema`).
2. Créer les instances `RouteBuilder` et `LinkBuilder`.
3. Utiliser `RouterProvider` dans `App.tsx`.
4. Utiliser `L.Link`/`L.NavLink` dans les composants pour la navigation.
5. Profiter d’un routage clair et typé.