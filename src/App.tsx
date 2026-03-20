import { RouterProvider } from 'react-router-dom'
import { R } from './routes/Routes'

export default function App() {
  return <RouterProvider router={R.routerAll()} />
}

