// Shared, cached queries for books and posts, with the derived fields the
// commonplace-book pages need (threads, passages, display dates, reading time).

export interface Book {
  path: string
  slug: string
  title: string
  author?: string
  date?: string
  year: string
  finished: string
  finishedMonth: string
  tags: string[]
  threads: string[]
  notes: boolean
  passages: string[][]
}

export interface Post {
  path: string
  title: string
  description?: string
  date?: string
  year: string
  dateShort: string
  dateLong: string
  dateDay: string
  minutes: number
  tags: string[]
  threads: string[]
  nearby: string[]
}

export function useBooks () {
  return useAsyncData('library-books', async () => {
    const rows = await queryCollection('content')
      .where('path', 'LIKE', '/reading/%')
      .select('path', 'title', 'author', 'date', 'tags', 'body')
      .order('date', 'DESC')
      .all()
    return rows.map((r): Book => ({
      path: r.path,
      slug: slugFromPath(r.path),
      title: r.title,
      author: r.author,
      date: r.date,
      year: yearOf(r.date),
      finished: formatDate(r.date, 'month'),
      finishedMonth: r.date ? new Date(r.date).toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' }) : '',
      tags: tagList(r.tags),
      threads: threadsFor(r.tags),
      notes: hasNotes(r.body as never),
      passages: extractPassages(r.body as never)
    }))
  })
}

export function usePosts () {
  return useAsyncData('library-posts', async () => {
    const rows = await queryCollection('content')
      .where('path', 'LIKE', '/articles/%')
      .select('path', 'title', 'description', 'date', 'tags', 'nearby', 'body')
      .order('date', 'DESC')
      .all()
    return rows.map((r): Post => ({
      path: r.path,
      title: r.title,
      description: r.description,
      date: r.date,
      year: yearOf(r.date),
      dateShort: formatDate(r.date, 'short'),
      dateLong: formatDate(r.date, 'long'),
      dateDay: formatDate(r.date, 'day'),
      minutes: readingMinutes(r.body as never),
      tags: tagList(r.tags),
      threads: threadsFor(r.tags),
      nearby: Array.isArray(r.nearby) ? r.nearby : []
    }))
  })
}
