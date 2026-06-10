migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('lessons', 'title', 'Aula 01: O inicio')
      record.set('video_url', 'https://youtu.be/3ADX3vwP6ws')
      app.save(record)
      console.log("Successfully updated video_url for lesson 'Aula 01: O inicio'")
    } catch (_) {
      console.log("Lesson 'Aula 01: O inicio' not found. Skipping video update.")
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('lessons', 'title', 'Aula 01: O inicio')
      if (record.getString('video_url') === 'https://youtu.be/3ADX3vwP6ws') {
        record.set('video_url', '')
        app.save(record)
      }
    } catch (_) {
      // Ignore if not found during rollback
    }
  },
)
