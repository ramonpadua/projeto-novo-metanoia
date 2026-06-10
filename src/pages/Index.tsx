import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourses, Course, getFileUrl } from '@/services/api'
import { useAuth } from '@/hooks/use-auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, PlayCircle } from 'lucide-react'

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
        return 'bg-transparent text-primary border-primary hover:bg-primary/10'
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
    <div className="container mx-auto p-6 md:p-8 animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-4xl font-serif text-foreground mb-2">
          Bem-vindo de volta, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Continue sua evolução. Escolha um curso para iniciar.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.15)] flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={
                    course.cover_image
                      ? getFileUrl(course, course.cover_image)
                      : `https://img.usecurling.com/p/800/450?q=cinematic%20luxury%20dark&color=black&seed=${course.id}`
                  }
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent pointer-events-none" />
                <Badge
                  className={`absolute top-4 left-4 font-semibold ${getBadgeStyle(course.type)}`}
                >
                  {getBadgeLabel(course.type)}
                </Badge>
              </div>

              <CardHeader className="flex-1 pb-4">
                <CardTitle className="text-xl font-serif leading-tight group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-sm mt-2 line-clamp-2 text-muted-foreground">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="pt-0">
                <Button
                  asChild
                  className="w-full bg-input hover:bg-primary hover:text-primary-foreground text-foreground transition-all duration-300"
                >
                  <Link to={`/curso/${course.id}`}>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Acessar Conteúdo
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
