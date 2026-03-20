// FICHIER : RouteBuilder.tsx (Version avec classes indépendantes)
import { type JSX } from 'react';
import {
    Link as RRLink,
    NavLink as RRNavLink,
    createBrowserRouter,
    type LinkProps as RRLinkProps,
    type NavLinkProps as RRNavLinkProps,
    type RouteObject,
} from 'react-router-dom';

// --- TYPES PARTAGÉS ---
export type RouteSchema<K extends string> = Record<K, RouteObject>;

export type LinkProps<T> = Omit<RRLinkProps, 'to'> & {
    routeName: keyof T;
    params?: Record<string, string | number>;
};

export type NavLinkProps<T> = Omit<RRNavLinkProps, 'to'> & {
    routeName: keyof T;
    params?: Record<string, string | number>;
};

// ====================================================================
// CLASSE 1 : RouteBuilder
// Responsabilité : Gérer la configuration et la génération du routeur.
// ====================================================================

export class RouteBuilder<T extends RouteSchema<string>> {
    public routes: T;

    constructor(routes: T) {
        this.routes = routes;
        this.router = this.router.bind(this);
        this.routerAll = this.routerAll.bind(this);
    }

    /**
     * Crée un routeur avec un sous-ensemble de routes spécifiées.
     */
    public router(routeNames: (keyof T)[], basename?: string) {
        const routerConfig = routeNames.map(name => this.routes[name]);
        return createBrowserRouter(routerConfig, { basename });
    }

    /**
     * Crée un routeur incluant toutes les routes définies dans le schéma.
     */
    public routerAll(basename?: string) {
        const allKeys = Object.keys(this.routes) as (keyof T)[];
        return this.router(allKeys, basename);
    }
}

// ====================================================================
// CLASSE 2 : LinkBuilder
// Responsabilité : Gérer la création des composants de lien <Link> et <NavLink>.
// ====================================================================

export class LinkBuilder<T extends RouteSchema<string>> {
    public routes: T;

    constructor(routes: T) {
        this.routes = routes;
        this.Link = this.Link.bind(this);
        this.NavLink = this.NavLink.bind(this);
        this.path = this.path.bind(this);
    }

    /**
     * (Logique dupliquée de RouteBuilder pour rendre la classe indépendante)
     * Génère une chaîne de caractères URL pour une route donnée en injectant les paramètres.
     */
    public path(routeName: keyof T, params: Record<string, string | number> = {}): string {
        let path = this.routes[routeName]?.path ?? '';
        for (const key in params) {
            path = path.replace(`:${key}`, String(params[key]));
        }
        return path;
    }

    /**
     * Crée un composant <Link> de react-router-dom typé pour votre schéma de routes.
     */
    public Link({ routeName, params, ...props }: LinkProps<T>): JSX.Element {
        return <RRLink to={this.path(routeName, params)} {...props} />;
    }

    /**
     * Crée un composant <NavLink> de react-router-dom typé pour votre schéma de routes.
     */
    public NavLink({ routeName, params, ...props }: NavLinkProps<T>): JSX.Element {
        return <RRNavLink to={this.path(routeName, params)} {...props} />;
    }
}