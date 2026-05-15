import { ResumePDF } from '@/components/ResumePDF'
import type { ResumeData } from '@/types/resume'

/**
 * Calls ResumePDF as a plain function (not a React component) so
 * renderToBuffer receives the <Document> element directly.
 * This avoids the $$typeof Symbol mismatch that occurs when a component
 * wrapper element is passed instead of the Document element itself.
 */
export function createResumeElement(data: ResumeData) {
  // Safe: ResumePDF has no hooks, so calling it as a function is fine.
  return ResumePDF({ data })
}
