import { Metadata } from 'next'
import { BlogSection } from '@/components/blog-section'

export const metadata: Metadata = {
  title: 'Blog de Viajes | Vola SV',
  description: 'Consejos, guías y tips para tus viajes en avión',
}

export default function BlogPage() {
  return <BlogSection />
}
