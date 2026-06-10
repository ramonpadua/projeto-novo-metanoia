import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import Layout from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Index from './pages/Index'
import Course from './pages/Course'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/curso/:id" element={<Course />} />
              {/* Other placeholder routes to prevent 404 on sidebar clicks */}
              <Route path="/cursos" element={<Index />} />
              <Route
                path="/favoritos"
                element={
                  <div className="p-8 text-center text-muted-foreground animate-fade-in">
                    Página em construção...
                  </div>
                }
              />
              <Route
                path="/suporte"
                element={
                  <div className="p-8 text-center text-muted-foreground animate-fade-in">
                    Página em construção...
                  </div>
                }
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
