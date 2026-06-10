migrate(
  (app) => {
    const courses = new Collection({
      name: 'courses',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        {
          name: 'cover_image',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        {
          name: 'type',
          type: 'select',
          values: ['free', 'paid', 'mentoria'],
          required: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(courses)

    const modules = new Collection({
      name: 'modules',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'course_id',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('courses').id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'sort_order', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(modules)

    const lessons = new Collection({
      name: 'lessons',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'module_id',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('modules').id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'video_url', type: 'url' },
        { name: 'content', type: 'editor' },
        { name: 'sort_order', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(lessons)

    const materials = new Collection({
      name: 'materials',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'lesson_id',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('lessons').id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'title', type: 'text' },
        { name: 'file', type: 'file', maxSelect: 1, maxSize: 10485760 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(materials)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('materials'))
    app.delete(app.findCollectionByNameOrId('lessons'))
    app.delete(app.findCollectionByNameOrId('modules'))
    app.delete(app.findCollectionByNameOrId('courses'))
  },
)
