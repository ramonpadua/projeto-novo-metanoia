migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'ramon.padua@adapta.org')
    } catch (_) {
      const u = new Record(users)
      u.setEmail('ramon.padua@adapta.org')
      u.setPassword('Skip@Pass')
      u.setVerified(true)
      u.set('name', 'Ramon Pádua')
      app.save(u)
    }

    const coursesCol = app.findCollectionByNameOrId('courses')
    const seedCourse = (title, desc, type) => {
      try {
        return app.findFirstRecordByData('courses', 'title', title)
      } catch (_) {
        const r = new Record(coursesCol)
        r.set('title', title)
        r.set('description', desc)
        r.set('type', type)
        app.save(r)
        return r
      }
    }

    const c1 = seedCourse(
      'Aprenda a Vender em Alta Performance',
      'Domine as técnicas psicológicas e práticas para bater metas recordes.',
      'paid',
    )
    const c2 = seedCourse(
      'Desenvolvimento Espiritual e Corpo',
      'A conexão entre o bem-estar físico e a evolução da consciência.',
      'paid',
    )
    const c3 = seedCourse(
      'Protocolo Metanoia',
      'Uma jornada de transformação mental completa.',
      'free',
    )
    const c4 = seedCourse(
      'Arquitetura da Ação - Mentoria',
      'Acompanhamento estratégico para transformar planos em resultados.',
      'mentoria',
    )

    const modulesCol = app.findCollectionByNameOrId('modules')
    const seedModule = (courseId, title, order) => {
      try {
        return app.findFirstRecordByData('modules', 'title', title)
      } catch (_) {
        const r = new Record(modulesCol)
        r.set('course_id', courseId)
        r.set('title', title)
        r.set('sort_order', order)
        app.save(r)
        return r
      }
    }

    const m1 = seedModule(c3.id, 'Módulo 1: Fundamentos', 1)
    const m2 = seedModule(c3.id, 'Módulo 2: A Prática', 2)

    const lessonsCol = app.findCollectionByNameOrId('lessons')
    const seedLesson = (modId, title, url, order) => {
      try {
        return app.findFirstRecordByData('lessons', 'title', title)
      } catch (_) {
        const r = new Record(lessonsCol)
        r.set('module_id', modId)
        r.set('title', title)
        r.set('video_url', url)
        r.set('sort_order', order)
        app.save(r)
        return r
      }
    }

    seedLesson(
      m1.id,
      'Aula 01: O Início',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      1,
    )
    seedLesson(
      m1.id,
      'Aula 02: O Poder da Mente',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      2,
    )
    seedLesson(
      m2.id,
      'Aula 03: Execução',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      1,
    )
  },
  (app) => {
    // Revert not strictly required for seed data as schema deletion cascades it
  },
)
