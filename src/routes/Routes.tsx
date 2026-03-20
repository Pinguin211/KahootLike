import { type RouteSchema, RouteBuilder, LinkBuilder } from 'MypkgReact/RouterBuilder/RouteBuilder'
import type { RouteObject } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import HomePage from '../pages/HomePage'
import QuizPage from '../pages/QuizPage'

// ─── Définition des routes individuelles ───────────────────────────────────
const HomeRoute: RouteObject = {
  index: true,
  element: <HomePage />,
}

const QuizRoute: RouteObject = {
  path: 'quiz/:dir/:id',
  element: <QuizPage />,
}

const RootRoute: RouteObject = {
  path: '/',
  element: <Layout />,
  children: [HomeRoute, QuizRoute],
}

// ─── Schéma pour RouteBuilder (construction du router) ─────────────────────
type RouteName = 'root'
const routeSchema: RouteSchema<RouteName> = {
  root: RootRoute,
}

/** Instance RouteBuilder — utilisée dans App.tsx pour monter le RouterProvider */
export const R = new RouteBuilder(routeSchema)

// ─── Schéma pour LinkBuilder (navigation typée) ────────────────────────────
type LinkName = 'home' | 'quiz'
const linkSchema: RouteSchema<LinkName> = {
  home: HomeRoute,
  quiz: QuizRoute,
}

/** Instance LinkBuilder — utilisée dans les composants pour <L.Link> et <L.NavLink> */
export const L = new LinkBuilder(linkSchema)
