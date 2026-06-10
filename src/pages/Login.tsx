import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Leaf } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: getErrorMessage(error),
      })
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 animate-fade-in relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl opacity-50" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-3xl opacity-50" />
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-card rounded-2xl shadow-sm flex items-center justify-center text-primary border border-border/50">
            <Leaf className="w-8 h-8" strokeWidth={1.5} />
          </div>
        </div>

        <Card className="border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-[2rem]">
          <CardHeader className="space-y-3 text-center pb-8 pt-10 px-10">
            <CardTitle className="text-3xl font-serif text-foreground tracking-wide">
              Metanoia
            </CardTitle>
            <CardDescription className="text-muted-foreground font-light text-base">
              Acesse seu espaço de evolução
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-foreground/80 font-medium ml-1">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-border/50 focus:border-primary rounded-xl h-12 px-4 shadow-sm"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" className="text-foreground/80 font-medium">
                    Senha
                  </Label>
                  <a
                    href="#"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 border-border/50 focus:border-primary rounded-xl h-12 px-4 shadow-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-medium bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 mt-4"
                disabled={loading}
              >
                {loading ? 'Acessando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
