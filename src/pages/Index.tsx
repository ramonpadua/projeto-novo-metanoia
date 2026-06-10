import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourses, Course, getFileUrl } from '@/services/api'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight } from 'lucide-react'

export default function Index() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCourses()
      .then((data) => {
        setCourses(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'free':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/90 border-transparent'
      case 'mentoria':
        return 'bg-accent text-accent-foreground hover:bg-accent/90 border-transparent'
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent'
    }
  }

  const getBadgeLabel = (type: string) => {
    switch (type) {
      case 'free':
        return 'Acesso Livre'
      case 'mentoria':
        return 'Mentoria'
      default:
        return 'Premium'
    }
  }

  return (
    <div className="container mx-auto p-6 md:p-12 lg:px-20 animate-fade-in-up max-w-7xl">
      <div className="mb-16 mt-8">
        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
          Bem-vindo, {user?.name?.split(' ')[0]}.
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-light tracking-wide">
          Continue sua jornada de evolução. O que você deseja aprender hoje?
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="group overflow-hidden bg-card border-transparent shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-3xl flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                <img
                  src={
                    course.cover_image
                      ? getFileUrl(course, course.cover_image)
                      : `https://img.usecurling.com/p/800/600?q=meditation%20nature%20calm&color=white&seed=${course.id}`
                  }
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Badge
                  className={`absolute top-4 left-4 font-medium px-3 py-1 text-xs tracking-wide ${getBadgeStyle(course.type)}`}
                >
                  {getBadgeLabel(course.type)}
                </Badge>
              </div>

              <CardHeader className="flex-1 px-8 pt-8 pb-4">
                <CardTitle className="text-2xl font-serif leading-tight group-hover:text-primary transition-colors duration-300">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-sm mt-3 line-clamp-2 text-muted-foreground leading-relaxed">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="px-8 pb-8 pt-0">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-between px-0 hover:bg-transparent hover:text-primary text-foreground transition-colors duration-300 group/btn"
                >
                  <Link to={`/curso/${course.id}`}>
                    <span className="font-medium tracking-wide">Acessar Conteúdo</span>
                    <ArrowRight
                      className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
