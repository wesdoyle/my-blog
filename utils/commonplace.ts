// Helpers for the commonplace-book layout: dates, reading time, threads, passages.

type MNode = string | [string, Record<string, unknown>, ...MNode[]]
interface MinimarkBody { type?: string, value?: MNode[] }

// Dates in front matter are plain YYYY-MM-DD strings. Format them in UTC so they
// never print a day early in Central time.
export function formatDate (date?: string, style: 'short' | 'long' | 'month' | 'day' = 'short'): string {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return date
  const opts: Intl.DateTimeFormatOptions =
    style === 'long' ? { year: 'numeric', month: 'long', day: 'numeric' }
      : style === 'month' ? { year: 'numeric', month: 'long' }
        : style === 'day' ? { month: 'long', day: 'numeric' }
          : { year: 'numeric', month: 'short', day: 'numeric' }
  return d.toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' })
}

export function yearOf (date?: string): string {
  return date ? String(date).slice(0, 4) : ''
}

export function slugFromPath (path: string): string {
  return path.split('/').filter(Boolean).pop() || ''
}

export function nodeText (node: MNode): string {
  if (typeof node === 'string') return node
  if (!Array.isArray(node)) return ''
  const [tag, , ...children] = node
  if (tag === 'br') return '\n'
  return children.map(nodeText).join('')
}

export function bodyNodes (body?: MinimarkBody | null): MNode[] {
  return (body && Array.isArray(body.value)) ? body.value : []
}

export function hasNotes (body?: MinimarkBody | null): boolean {
  return bodyNodes(body).some(n => nodeText(n).trim().length > 0)
}

export function wordCount (body?: MinimarkBody | null): number {
  return bodyNodes(body).map(nodeText).join(' ').split(/\s+/).filter(Boolean).length
}

export function readingMinutes (body?: MinimarkBody | null): number {
  return Math.max(1, Math.round(wordCount(body) / 200))
}

function cleanPassage (s: string): string {
  let t = s.replace(/\s+/g, ' ').trim()
  t = t.replace(/['’]?,\s*$/, '').trim()
  // Drop a dangling apostrophe left over from the old reading-list format.
  const quotes = (t.match(/'/g) || []).length
  if (quotes % 2 === 1 && /'$/.test(t)) t = t.slice(0, -1).trim()
  return t
}

// Every blockquote in a book's notes is a copied passage. Each passage is a list
// of paragraphs.
export function extractPassages (body?: MinimarkBody | null): string[][] {
  const out: string[][] = []
  for (const node of bodyNodes(body)) {
    if (!Array.isArray(node) || node[0] !== 'blockquote') continue
    const [, , ...children] = node
    const paras = children
      .filter(c => Array.isArray(c) && c[0] === 'p')
      .map(c => cleanPassage(nodeText(c)))
      .filter(Boolean)
    if (!paras.length) {
      const t = cleanPassage(nodeText(node))
      if (t) paras.push(t)
    }
    if (paras.length) out.push(paras)
  }
  return out
}

// Threads: the seven clusters the shelf can be filtered by. A book or post joins
// a thread when one of its tags matches.
export interface Thread { id: string, name: string, tags: string[] }

export const THREADS: Thread[] = [
  {
    id: 'contemplative',
    name: 'Contemplative practice',
    tags: ['religion', 'christianity', 'mindfulness', 'theology', 'meditation', 'mysticism', 'contemplation',
      'spirituality', 'yoga', 'tibet', 'lojong', 'non-dualism', 'hinduism', 'hindusim', 'indian spirituality',
      'gospel', 'god', 'biblical', 'christian gnosticism', 'contemplative tradition', 'praise', 'peace', 'wisdom',
      'practice', 'basics', 'first-principles']
  },
  {
    id: 'nature',
    name: 'Nature and place',
    tags: ['nature', 'ecology', 'nature writing', 'natural-history', 'mosses', 'botany', 'landscape', 'walking',
      'environmentalism', 'agriculture', 'trancendentalist', 'biology', 'food', 'travel']
  },
  {
    id: 'mind',
    name: 'Mind and meaning',
    tags: ['psychology', 'philosophy', 'consciousness', 'neuroscience', 'brain', 'reality', 'symbols', 'time',
      'human nature', 'emergent phenomena', 'consilience', 'deduction', 'science', 'physics', 'epistemology',
      'linguistics', 'language', 'grief', 'life', 'vulnerability']
  },
  {
    id: 'fiction',
    name: 'Fiction and poetry',
    tags: ['literature', 'russian', 'german', 'bildungsroman', 'poetry', 'short story', 'short stories',
      'science fiction', 'epic fantasy', 'romance', 'cyberpunk', 'tech thriller', 'beat literature',
      'american literature', 'nebraska', 'argentina', 'virgnia woolf', 'essays', 'writing']
  },
  {
    id: 'engineering',
    name: 'Engineering and craft',
    tags: ['leadership', 'engineering', 'business', 'devops', 'software', 'software engineering', 'management',
      'teams', 'startups', 'sre', 'okrs', 'project management', 'software architecture', 'microservices',
      'enterprise architecture', 'distributed systems', 'databases', 'scalability', 'career', 'work', 'habits',
      'goals', 'discipline', 'systems', 'complexity', 'open source', 'github', 'tech industry',
      'software development', 'expertise', 'testing', 'oop', 'refactoring', 'postgres', 'data-munging']
  },
  {
    id: 'information',
    name: 'Information and computation',
    tags: ['computer science', 'networking', 'information theory', 'information', 'information age',
      'cryptography', 'cybersecurity', 'privacy', 'computation', 'turing', 'claude shannon', 'machine learning',
      'technology and politics', 'ai', 'future']
  },
  {
    id: 'history',
    name: 'History and peoples',
    tags: ['history', 'ancient history', 'american-history', 'memoir', 'biography', 'archaeology', 'anthropology',
      'mesoamerica', 'north america', 'vikings', 'scandanavia', 'slavery', '20th-century', '19th century',
      '20th century', 'political', 'journalism', 'anarchism', 'autobiography', 'society', 'indegenous wisdom']
  }
]

export function tagList (tags?: string | string[] | null): string[] {
  if (!tags) return []
  const list = Array.isArray(tags) ? tags : String(tags).split(',')
  return list.map(t => String(t).trim().toLowerCase()).filter(Boolean)
}

export function threadsFor (tags?: string | string[] | null): string[] {
  const list = tagList(tags)
  return THREADS.filter(th => th.tags.some(t => list.includes(t))).map(th => th.id)
}

export function threadForTag (tag: string): Thread | undefined {
  const t = tag.trim().toLowerCase()
  return THREADS.find(th => th.tags.includes(t))
}

export function threadName (id?: string): string {
  return THREADS.find(th => th.id === id)?.name || ''
}
