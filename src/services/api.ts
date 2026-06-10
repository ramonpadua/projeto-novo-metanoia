import pb from '@/lib/pocketbase/client'
import { RecordModel } from 'pocketbase'

export interface Course extends RecordModel {
  title: string
  description: string
  cover_image: string
  type: 'free' | 'paid' | 'mentoria'
}

export interface Module extends RecordModel {
  course_id: string
  title: string
  sort_order: number
}

export interface Lesson extends RecordModel {
  module_id: string
  title: string
  video_url: string
  content: string
  sort_order: number
}

export interface Material extends RecordModel {
  lesson_id: string
  title: string
  file: string
}

export const getCourses = () => pb.collection('courses').getFullList<Course>({ sort: '-created' })

export const getCourse = (id: string) => pb.collection('courses').getOne<Course>(id)

export const getCourseModules = (courseId: string) =>
  pb.collection('modules').getFullList<Module>({
    filter: `course_id = "${courseId}"`,
    sort: 'sort_order',
  })

export const getCourseLessons = (courseId: string) =>
  pb.collection('lessons').getFullList<Lesson>({
    filter: `module_id.course_id = "${courseId}"`,
    sort: 'sort_order',
  })

export const getLessonMaterials = (lessonId: string) =>
  pb.collection('materials').getFullList<Material>({
    filter: `lesson_id = "${lessonId}"`,
  })

export const getFileUrl = (record: RecordModel, filename: string) =>
  pb.files.getURL(record, filename)
