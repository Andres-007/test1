import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { blogPosts } from '@/lib/blog-data'
import { BlogPostDetail } from '@/components/blog-post-detail'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const post = blogPosts.find(p => p.id === id)
  
  if (!post) {
    return { title: 'Artículo no encontrado' }
  }

  return {
    title: `${post.title} | Vola SV Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params
  const post = blogPosts.find(p => p.id === id)

  if (!post) {
    notFound()
  }

  return <BlogPostDetail post={post} />
}
