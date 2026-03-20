import { RouterProvider } from 'react-router-dom'
import { R } from './routes/Routes'

const appRouter = R.routerAll(import.meta.env.BASE_URL)

export default function App() {
  return <RouterProvider router={appRouter} />
}

