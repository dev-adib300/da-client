import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Main from './Layout/Main.jsx'
import Home from './Pages/Home/Home/Home.jsx'
import About from './Pages/About/About.jsx'
import Dash from './Pages/Dash/Dash.jsx'
import Card from './Pages/Card/Card.jsx'
import Registration from './Pages/Registration/Registration.jsx'
import Renewal from './Pages/Renewal/Renewal.jsx'
import Payment from './Pages/Payment/Payment.jsx'
import PaymentSuccess from './Pages/PaymentSuccess/PaymentSuccess.jsx'
import AdminLogin from './Pages/AdminLogin/AdminLogin.jsx'
import AdminMemberDetails from './Pages/AdminMemberDetails/AdminMemberDetails.jsx'
import AdminProtectedRoute from './Components/AdminProtectedRoute.jsx'
import NotFound from './Components/NotFound.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main></Main>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: '/registration/:plan',
        element: <Registration></Registration>
      },
      {
        path: '/payment',
        element: <Payment></Payment>
      },
      {
        path: '/payment/success',
        element: <PaymentSuccess></PaymentSuccess>
      },
      {
        path: '/renewal',
        element: <Renewal></Renewal>
      },
      {
        path: '/admin/login',
        element: <AdminLogin></AdminLogin>
      },
      {
        path: '/admin/members',
        element: <AdminProtectedRoute><Dash></Dash></AdminProtectedRoute>
      },
      {
        path: '/admin/members/:memberId',
        element: <AdminProtectedRoute><AdminMemberDetails></AdminMemberDetails></AdminProtectedRoute>
      },
      {
        path: '/member/:token',
        element: <Card></Card>
      },
      {
        path: '/about',
        element: <About></About>
      },
      {
        path: '/*',
        element: <NotFound></NotFound>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
