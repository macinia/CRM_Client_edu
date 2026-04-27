import { defineStore } from 'pinia'

function createDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getWeekdayFromDate(date) {
  const day = date.getDay()
  return day === 0 ? 7 : day
}

function getLessonDurationMinutes(startAt, endAt) {
  const start = new Date(startAt)
  const end = new Date(endAt)

  return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
}

function isIntervalsIntersect(startA, endA, startB, endB) {
  const aStart = new Date(startA).getTime()
  const aEnd = new Date(endA).getTime()
  const bStart = new Date(startB).getTime()
  const bEnd = new Date(endB).getTime()

  return aStart < bEnd && aEnd > bStart
}

function generateLessonsFromSeries(seriesList) {
  const lessons = []
  let nextLessonId = 1

  seriesList.forEach((series) => {
    const startDate = new Date(`${series.startDate}T00:00:00`)
    const endDate = new Date(`${series.endDate}T00:00:00`)
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const weekday = getWeekdayFromDate(currentDate)
      const matchedRules = series.schedule.filter((rule) => rule.weekday === weekday)

      matchedRules.forEach((rule) => {
        const dateKey = createDateKey(currentDate)

        lessons.push({
          id: nextLessonId++,
          seriesId: series.id,
          teacherId: series.teacherId,
          clientId: series.clientId,
          subject: series.subject,
          startAt: `${dateKey}T${rule.startTime}:00`,
          endAt: `${dateKey}T${rule.endTime}:00`,
          tariffId: series.tariffId ?? null,
          teacherRateId: series.teacherRateId ?? null,
          status: 'scheduled',
          attendanceStatus: 'not_selected',
          meetingLink: '',
          comment: '',
          organizationId: series.organizationId,
          createdAt: series.createdAt,
          updatedAt: series.updatedAt,
        })
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }
  })

  return lessons
}

const initialLessonSeries = [
  {
    id: 1,
    teacherId: 2,
    clientId: 1,
    subject: 'Математика',
    startDate: '2026-04-06',
    endDate: '2026-05-31',
    schedule: [
      { weekday: 1, startTime: '09:00', endTime: '10:00' },
      { weekday: 3, startTime: '16:30', endTime: '17:30' },
    ],
    status: 'active',
    organizationId: 0,
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  },
  {
    id: 2,
    teacherId: 5,
    clientId: 2,
    subject: 'Физика',
    startDate: '2026-04-07',
    endDate: '2026-05-31',
    schedule: [
      { weekday: 2, startTime: '14:00', endTime: '15:30' },
      { weekday: 5, startTime: '11:00', endTime: '12:00' },
    ],
    status: 'active',
    organizationId: 0,
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  },
  {
    id: 3,
    teacherId: 2,
    clientId: 3,
    subject: 'Алгебра',
    startDate: '2026-04-10',
    endDate: '2026-05-15',
    schedule: [{ weekday: 5, startTime: '09:15', endTime: '10:00' }],
    status: 'active',
    organizationId: 0,
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  },
  {
    id: 4,
    teacherId: 5,
    clientId: 1,
    subject: 'Математика',
    startDate: '2026-04-08',
    endDate: '2026-05-31',
    schedule: [{ weekday: 4, startTime: '10:00', endTime: '11:00' }],
    status: 'active',
    organizationId: 0,
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  },
  {
    id: 5,
    teacherId: 6,
    clientId: 2,
    subject: 'Русский язык',
    startDate: '2026-04-09',
    endDate: '2026-05-31',
    schedule: [{ weekday: 4, startTime: '17:00', endTime: '18:00' }],
    status: 'active',
    organizationId: 0,
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  },
]

const initialOffHours = [
  {
    id: 1,
    teacherId: 2,
    startAt: '2026-04-15T12:00:00',
    endAt: '2026-04-15T15:00:00',
    reason: 'Личное время',
    organizationId: 0,
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  },
  {
    id: 2,
    teacherId: 5,
    startAt: '2026-04-17T09:00:00',
    endAt: '2026-04-17T12:00:00',
    reason: 'Методический день',
    organizationId: 0,
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  },
  {
    id: 3,
    teacherId: 6,
    startAt: '2026-04-16T13:00:00',
    endAt: '2026-04-16T16:00:00',
    reason: 'Отсутствие',
    organizationId: 0,
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  },
]

const initialLessons = generateLessonsFromSeries(initialLessonSeries)

export const useLessonsStore = defineStore('lessons', {
  state: () => ({
    lessonSeries: initialLessonSeries,
    lessons: initialLessons,
    offHours: initialOffHours,
  }),

  getters: {
    getLessonById: (state) => (lessonId) => {
      return state.lessons.find((lesson) => lesson.id === lessonId) || null
    },

    getLessonsByTeacherId: (state) => (teacherId) => {
      return state.lessons.filter((lesson) => Number(lesson.teacherId) === Number(teacherId))
    },

    getLessonsByClientId: (state) => (clientId) => {
      return state.lessons.filter((lesson) => Number(lesson.clientId) === Number(clientId))
    },

    getSeriesByTeacherId: (state) => (teacherId) => {
      return state.lessonSeries.filter((series) => Number(series.teacherId) === Number(teacherId))
    },

    getOffHoursByTeacherId: (state) => (teacherId) => {
      return state.offHours.filter((item) => Number(item.teacherId) === Number(teacherId))
    },

    getLessonsByTeacherInRange: (state) => (teacherId, startAt, endAt) => {
      return state.lessons.filter((lesson) => {
        return (
          Number(lesson.teacherId) === Number(teacherId) &&
          lesson.status !== 'cancelled' &&
          isIntervalsIntersect(lesson.startAt, lesson.endAt, startAt, endAt)
        )
      })
    },

    getOffHoursByTeacherInRange: (state) => (teacherId, startAt, endAt) => {
      return state.offHours.filter((item) => {
        return (
          Number(item.teacherId) === Number(teacherId) &&
          isIntervalsIntersect(item.startAt, item.endAt, startAt, endAt)
        )
      })
    },
  },

  actions: {
    getNextId(items) {
      if (!items.length) return 1
      return Math.max(...items.map((item) => item.id)) + 1
    },

    createLesson(lesson) {
      const now = new Date().toISOString()

      const newLesson = {
        ...lesson,
        id: this.getNextId(this.lessons),
        status: lesson.status || 'scheduled',
        attendanceStatus: lesson.attendanceStatus || 'not_selected',
        meetingLink: lesson.meetingLink || '',
        comment: lesson.comment || '',
        createdAt: now,
        updatedAt: now,
      }

      this.lessons.push(newLesson)
      return newLesson
    },

    createLessonSeries(series) {
      const now = new Date().toISOString()

      const newSeries = {
        ...series,
        id: this.getNextId(this.lessonSeries),
        teacherId: Number(series.teacherId),
        clientId: Number(series.clientId),
        schedule: series.schedule.map((rule) => ({
          weekday: Number(rule.weekday),
          startTime: rule.startTime,
          endTime: rule.endTime,
        })),
        status: series.status || 'active',
        createdAt: now,
        updatedAt: now,
      }

      this.lessonSeries.push(newSeries)

      const startDate = new Date(`${newSeries.startDate}T00:00:00`)
      const endDate = new Date(`${newSeries.endDate}T00:00:00`)
      const currentDate = new Date(startDate)
      const generatedLessons = []

      while (currentDate <= endDate) {
        const weekday = getWeekdayFromDate(currentDate)
        const matchedRules = newSeries.schedule.filter((rule) => rule.weekday === weekday)

        matchedRules.forEach((rule) => {
          const dateKey = createDateKey(currentDate)

          const lesson = this.createLesson({
            seriesId: newSeries.id,
            teacherId: newSeries.teacherId,
            clientId: newSeries.clientId,
            subject: newSeries.subject,
            startAt: `${dateKey}T${rule.startTime}:00`,
            endAt: `${dateKey}T${rule.endTime}:00`,
            tariffId: newSeries.tariffId ?? null,
            teacherRateId: newSeries.teacherRateId ?? null,
            status: 'scheduled',
            attendanceStatus: 'not_selected',
            meetingLink: '',
            comment: '',
            organizationId: newSeries.organizationId ?? 0,
          })

          generatedLessons.push(lesson)
        })

        currentDate.setDate(currentDate.getDate() + 1)
      }

      return {
        series: newSeries,
        lessons: generatedLessons,
      }
    },

    updateLesson(updatedLesson) {
      const index = this.lessons.findIndex((lesson) => lesson.id === updatedLesson.id)

      if (index === -1) return

      this.lessons[index] = {
        ...this.lessons[index],
        ...updatedLesson,
        updatedAt: new Date().toISOString(),
      }
    },

    deleteLesson(id) {
      this.lessons = this.lessons.filter((lesson) => lesson.id !== id)
    },

    deleteLessonSeries(seriesId) {
      this.lessonSeries = this.lessonSeries.filter((series) => series.id !== seriesId)
      this.lessons = this.lessons.filter((lesson) => lesson.seriesId !== seriesId)
    },

    createOffHours(offHours) {
      const now = new Date().toISOString()

      const newOffHours = {
        ...offHours,
        id: this.getNextId(this.offHours),
        teacherId: Number(offHours.teacherId),
        createdAt: now,
        updatedAt: now,
      }

      this.offHours.push(newOffHours)
      return newOffHours
    },

    updateOffHours(updatedOffHours) {
      const index = this.offHours.findIndex((item) => item.id === updatedOffHours.id)

      if (index === -1) return

      this.offHours[index] = {
        ...this.offHours[index],
        ...updatedOffHours,
        teacherId: Number(updatedOffHours.teacherId),
        updatedAt: new Date().toISOString(),
      }
    },

    deleteOffHours(id) {
      this.offHours = this.offHours.filter((item) => item.id !== id)
    },

    getLessonDurationMinutes,
  },
})
