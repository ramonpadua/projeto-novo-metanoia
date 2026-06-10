migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('modules')
    col.fields.add(new URLField({ name: 'video_url' }))
    app.save(col)

    let course
    try {
      const courses = app.findRecordsByFilter(
        'courses',
        "title = 'Aprenda a Vender em Alta Performance'",
        '',
        1,
        0,
      )
      if (courses.length > 0) course = courses[0]
    } catch (e) {}

    if (!course) {
      const coursesCol = app.findCollectionByNameOrId('courses')
      course = new Record(coursesCol)
      course.set('title', 'Aprenda a Vender em Alta Performance')
      course.set('type', 'paid')
      app.save(course)
    }

    let mod
    try {
      const modules = app.findRecordsByFilter(
        'modules',
        `course_id = '${course.id}'`,
        'sort_order',
        1,
        0,
      )
      if (modules.length > 0) mod = modules[0]
    } catch (e) {}

    if (!mod) {
      const modulesCol = app.findCollectionByNameOrId('modules')
      mod = new Record(modulesCol)
      mod.set('course_id', course.id)
      mod.set('title', 'Módulo 1: Introdução às Vendas')
      mod.set('sort_order', 1)
    }

    mod.set('video_url', 'https://youtu.be/mm4xtUM9hc0')
    app.save(mod)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('modules')
    col.fields.removeByName('video_url')
    app.save(col)
  },
)
