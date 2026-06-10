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
import { Button } from '@/components/ui/button'
import {
  Loader2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Play,
  ArrowLeft,
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
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="p-12 text-center text-muted-foreground font-light">Curso não encontrado.</div>
    )
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
    <div className="flex flex-col lg:flex-row h-full min-h-screen bg-background animate-fade-in">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-8 py-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <Link to="/">
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-serif text-foreground">{course.title}</h1>
            <p className="text-sm text-muted-foreground">{activeModule?.title || 'Conteúdo'}</p>
          </div>
        </div>

        <div className="px-8 pb-12 flex-1 overflow-auto">
          {activeLesson && (
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="aspect-video bg-black/5 rounded-3xl overflow-hidden shadow-sm relative">
                {activeLesson.video_url ? (
                  <video
                    src={activeLesson.video_url}
                    controls
                    className="w-full h-full object-cover"
                    poster={`https://img.usecurling.com/p/1280/720?q=meditation%20minimalist&color=white&seed=${activeLesson.id}`}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground font-light">
                    Vídeo indisponível no momento
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-border/50 pb-8">
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-4xl font-serif text-foreground">
                    {activeLesson.title}
                  </h2>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    variant="outline"
                    className="rounded-full px-6 font-medium border-border/50"
                    onClick={handlePrev}
                    disabled={lessons.findIndex((l) => l.id === activeLesson.id) === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" strokeWidth={1.5} /> Anterior
                  </Button>
                  <Button
                    className="rounded-full px-6 font-medium shadow-sm"
                    onClick={handleNext}
                    disabled={
                      lessons.findIndex((l) => l.id === activeLesson.id) === lessons.length - 1
                    }
                  >
                    Próxima <ChevronRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="descricao" className="w-full">
                <TabsList className="bg-transparent border-b border-border/50 w-full justify-start rounded-none p-0 h-auto space-x-8">
                  <TabsTrigger
                    value="descricao"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-base font-medium text-muted-foreground data-[state=active]:text-foreground"
                  >
                    Descrição
                  </TabsTrigger>
                  <TabsTrigger
                    value="materiais"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-base font-medium text-muted-foreground data-[state=active]:text-foreground"
                  >
                    Materiais
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="descricao"
                  className="pt-8 text-foreground/80 text-base leading-relaxed font-light"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        activeLesson.content ||
                        '<p>Nenhuma descrição disponível para esta aula.</p>',
                    }}
                  />
                </TabsContent>
                <TabsContent value="materiais" className="pt-8 space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <FileText className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-base font-medium text-foreground">Guia de Prática.pdf</p>
                        <p className="text-sm text-muted-foreground font-light">
                          Material Complementar (1.2 MB)
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-primary hover:bg-primary/5 rounded-full px-6"
                    >
                      Baixar
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-[400px] bg-card flex flex-col border-t lg:border-t-0 lg:border-l border-border/50 h-[50vh] lg:h-auto shrink-0 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)]">
        <div className="p-8 border-b border-border/50 bg-card/80 backdrop-blur sticky top-0 z-10">
          <h3 className="font-serif text-2xl text-foreground">Módulos</h3>
          <p className="text-sm text-muted-foreground mt-2 font-light tracking-wide">
            {lessons.length} aulas • {modules.length} módulos
          </p>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-2">
          <Accordion type="multiple" defaultValue={modules.map((m) => m.id)} className="w-full">
            {modules.map((mod, index) => {
              const modLessons = lessons.filter((l) => l.module_id === mod.id)
              return (
                <AccordionItem
                  value={mod.id}
                  key={mod.id}
                  className="border-none mb-2 bg-muted/30 rounded-2xl overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline px-6 py-5 data-[state=open]:pb-2">
                    <div className="flex flex-col items-start text-left gap-1">
                      <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                        Módulo {index + 1}
                      </span>
                      <span className="font-serif text-lg text-foreground">{mod.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 px-3 space-y-1">
                    {modLessons.map((lesson, idx) => {
                      const isActive = activeLesson?.id === lesson.id
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-card shadow-sm border border-border/50' : 'hover:bg-card/50 border border-transparent'}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                          >
                            {isActive ? (
                              <Play className="w-3.5 h-3.5 ml-0.5" strokeWidth={2} />
                            ) : (
                              <span className="text-xs font-medium">{idx + 1}</span>
                            )}
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span
                              className={`text-sm truncate ${isActive ? 'text-foreground font-medium' : 'text-foreground/70 font-light'}`}
                            >
                              {lesson.title}
                            </span>
                          </div>
                          {!isActive && (
                            <CheckCircle2
                              className="w-4 h-4 text-muted-foreground/30 shrink-0"
                              strokeWidth={1.5}
                            />
                          )}
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
