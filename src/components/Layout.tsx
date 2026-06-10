import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, PlaySquare, Heart, HelpCircle, LogOut, User, Search, Leaf } from 'lucide-react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const location = useLocation()
  const { user, signOut } = useAuth()

  const menuItems = [
    { title: 'Início', icon: Home, url: '/' },
    { title: 'Meus Cursos', icon: PlaySquare, url: '/cursos' },
    { title: 'Favoritos', icon: Heart, url: '/favoritos' },
    { title: 'Suporte', icon: HelpCircle, url: '/suporte' },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <Sidebar variant="inset" className="border-r border-border/40 bg-card">
          <SidebarHeader className="p-8 border-b border-border/40">
            <Link to="/" className="flex items-center gap-3 justify-center group">
              <Leaf
                className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300"
                strokeWidth={1.5}
              />
              <h1 className="text-xl font-serif text-foreground tracking-widest uppercase mt-1">
                Metanoia
              </h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent className="mt-8 px-4">
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.url
                    return (
                      <SidebarMenuItem key={item.title} className="mb-2">
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={
                            isActive
                              ? 'bg-primary/5 text-primary rounded-xl'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors duration-300'
                          }
                        >
                          <Link to={item.url} className="flex items-center gap-4 px-4 py-3 h-auto">
                            <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                            <span className="font-medium text-sm tracking-wide">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 bg-background/50">
          <header className="h-20 border-b border-border/40 flex items-center justify-between px-8 bg-card/50 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-6 flex-1">
              <div className="md:hidden">
                <SidebarTrigger className="text-muted-foreground [&_svg]:size-6" />
              </div>
              <div className="relative w-full max-w-md hidden md:block">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <Input
                  placeholder="O que você procura?"
                  className="pl-11 bg-background border-border/50 focus-visible:ring-primary rounded-full h-11 text-sm shadow-sm transition-shadow hover:shadow-md"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-11 w-11 rounded-full border border-border/50 hover:border-primary/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.avatar ? `/api/files/users/${user.id}/${user.avatar}` : ''}
                        alt={user?.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 rounded-2xl p-2 shadow-xl border-border/50"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1.5">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem className="cursor-pointer rounded-xl p-3 focus:bg-muted">
                    <User className="mr-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    <span className="font-medium text-sm">Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer rounded-xl p-3 focus:bg-destructive/10 focus:text-destructive text-destructive mt-1"
                    onClick={signOut}
                  >
                    <LogOut className="mr-3 h-4 w-4" strokeWidth={1.5} />
                    <span className="font-medium text-sm">Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
