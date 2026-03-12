import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stores, storePages, storeSections } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/stores/[storeLink] - Get specific store by link
export async function GET(request: NextRequest, { params }: { params: Promise<{ storeLink: string }> }) {
  try {
    const { storeLink } = await params

    if (!storeLink) {
      return NextResponse.json({ error: 'Store link is required' }, { status: 400 })
    }

    // Get store from database
    const storeData = await db
      .select({
        id: stores.id,
        userId: stores.userId,
        name: stores.name,
        phone: stores.phone,
        link: stores.link,
        domain: stores.domain,
        isActive: stores.isActive,
        isPublished: stores.isPublished,
        theme: stores.theme,
        logo: stores.logo,
        favicon: stores.favicon,
        settings: stores.settings,
        createdAt: stores.createdAt,
        updatedAt: stores.updatedAt,
      })
      .from(stores)
      .where(eq(stores.link, storeLink))
      .limit(1)

    if (storeData.length === 0) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const store = storeData[0]

    // Get store pages
    const pagesData = await db
      .select({
        id: storePages.id,
        storeId: storePages.storeId,
        title: storePages.title,
        slug: storePages.slug,
        content: storePages.content,
        isPublished: storePages.isPublished,
        isHomePage: storePages.isHomePage,
        order: storePages.order,
        seoTitle: storePages.seoTitle,
        seoDescription: storePages.seoDescription,
        createdAt: storePages.createdAt,
        updatedAt: storePages.updatedAt,
      })
      .from(storePages)
      .where(eq(storePages.storeId, store.id))
      .orderBy(storePages.order)

    // Get sections for each page
    const pagesWithSections = await Promise.all(
      pagesData.map(async (page) => {
        const sectionsData = await db
          .select({
            id: storeSections.id,
            pageId: storeSections.pageId,
            type: storeSections.type,
            content: storeSections.content,
            order: storeSections.order,
            isVisible: storeSections.isVisible,
            settings: storeSections.settings,
            createdAt: storeSections.createdAt,
            updatedAt: storeSections.updatedAt,
          })
          .from(storeSections)
          .where(eq(storeSections.pageId, page.id))
          .orderBy(storeSections.order)

        return {
          ...page,
          sections: sectionsData
        }
      })
    )

    return NextResponse.json({ 
      store: {
        ...store,
        pages: pagesWithSections
      }
    })
  } catch (error) {
    console.error('Error fetching store:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
