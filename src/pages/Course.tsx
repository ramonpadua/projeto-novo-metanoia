import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  getCourse,
  getCourseModules,
  getCourseLessons,
  Course as CourseType,
  Module,
  Lesson,
} from '@/services/api'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  PlayCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react'

export default function Course() {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<CourseType | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([getCourse(id), getCourseModules(id), getCourseLessons(id)])
      .then(([c, m, l]) => {
        setCourse(c)
        setModules(m)
        setLessons(l)
        if (l.length > 0) setActiveLesson(l[0])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!course) {
    return <div className="p-8 text-center text-muted-foreground">Curso não encontrado.</div>
  }

  const activeModule = modules.find((m) => m.id === activeLesson?.module_id)

  const handleNext = () => {
    if (!activeLesson) return
    const currentIndex = lessons.findIndex((l) => l.id === activeLesson.id)
    if (currentIndex < lessons.length - 1) setActiveLesson(lessons[currentIndex + 1])
  }

  const handlePrev = () => {
    if (!activeLesson) return
    const currentIndex = lessons.findIndex((l) => l.id === activeLesson.id)
    if (currentIndex > 0) setActiveLesson(lessons[currentIndex - 1])
  }

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <div className="flex-1 flex flex-col border-r border-border min-w-0">
        <div className="p-4 border-b border-border bg-background">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Início</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{course.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="p-4 md:p-6 flex-1 overflow-auto">
          {activeLesson && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-primary tracking-wide uppercase">
                  {activeModule?.title}
                </p>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                  {activeLesson.title}
                </h2>
              </div>

              <div className="aspect-video bg-black rounded-xl overflow-hidden border border-border/50 shadow-2xl relative">
                {activeLesson.video_url ? (
                  <video
                    src={activeLesson.video_url}
                    controls
                    className="w-full h-full object-cover"
                    poster={`https://img.usecurling.com/p/1280/720?q=cinematic%20video%20player&seed=${activeLesson.id}`}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Vídeo indisponível
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center py-4">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={lessons.findIndex((l) => l.id === activeLesson.id) === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={
                    lessons.findIndex((l) => l.id === activeLesson.id) === lessons.length - 1
                  }
                >
                  Próxima <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <Tabs defaultValue="materiais" className="w-full mt-8">
                <TabsList className="bg-input/50 border border-border p-1">
                  <TabsTrigger
                    value="materiais"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Materiais Complementares
                  </TabsTrigger>
                  <TabsTrigger
                    value="descricao"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Descrição da Aula
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="materiais"
                  className="p-4 bg-card rounded-lg border border-border mt-2"
                >
                  <div className="flex items-center gap-3 p-3 rounded-md hover:bg-input transition-colors cursor-pointer border border-transparent hover:border-border">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Resumo da Aula.pdf</p>
                      <p className="text-xs text-muted-foreground">Documento PDF (2.4 MB)</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent
                  value="descricao"
                  className="p-4 bg-card rounded-lg border border-border mt-2 text-muted-foreground text-sm leading-relaxed"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        activeLesson.content || 'Nenhuma descrição disponível para esta aula.',
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-80 xl:w-96 bg-card flex flex-col border-t lg:border-t-0 border-border h-[50vh] lg:h-auto shrink-0">
        <div className="p-4 border-b border-border bg-background/50 backdrop-blur sticky top-0 z-10">
          <h3 className="font-serif text-lg text-foreground">Conteúdo do Curso</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {lessons.length} aulas • {modules.length} módulos
          </p>
        </div>

        <div className="flex-1 overflow-auto p-2">
          <Accordion type="multiple" defaultValue={modules.map((m) => m.id)} className="w-full">
            {modules.map((mod) => {
              const modLessons = lessons.filter((l) => l.module_id === mod.id)
              return (
                <AccordionItem value={mod.id} key={mod.id} className="border-border">
                  <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors px-2 py-3">
                    <div className="flex flex-col items-start text-left">
                      <span className="font-semibold text-sm">{mod.title}</span>
                      <span className="text-xs text-muted-foreground font-normal mt-0.5">
                        {modLessons.length} aulas
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 pt-0 space-y-1">
                    {modLessons.map((lesson, idx) => {
                      const isActive = activeLesson?.id === lesson.id
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-all duration-200 ${isActive ? 'bg-primary/10 border border-primary/20 shadow-inner' : 'hover:bg-input border border-transparent'}`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isActive ? (
                              <PlayCircle className="w-4 h-4 text-primary animate-pulse" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-muted-foreground/50" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span
                              className={`text-sm ${isActive ? 'text-primary font-medium' : 'text-foreground/80'}`}
                            >
                              {idx + 1}. {lesson.title}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
