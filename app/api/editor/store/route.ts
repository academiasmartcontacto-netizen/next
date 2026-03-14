import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { stores } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

// GET Store Data
export async function GET(request: Request) {
    try {
        // Obtener userId desde las cookies de tu sistema de autenticación
        const cookieStore = cookies();
        const userCookie = cookieStore.get('user');
        
        let userId: string | null = null;
        
        if (userCookie) {
            try {
                const userData = JSON.parse(userCookie.value);
                userId = userData.id;
            } catch (error) {
                console.error("Error parsing user cookie:", error);
            }
        }
        
        // Si no hay userId en cookies, intentar desde headers (para testing)
        if (!userId) {
            const authHeader = request.headers.get('authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                userId = authHeader.substring(7);
            }
        }
        
        // Si todavía no hay userId, usar temporal para pruebas
        if (!userId) {
            console.log("No userId found, using temporary for testing");
            userId = "00000000-0000-0000-0000-000000000001";
        }

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userStore = await db.select().from(stores).where(eq(stores.userId, userId));

        if (!userStore || userStore.length === 0) {
            console.log("No store found for userId:", userId);
            return new NextResponse("Store not found", { status: 404 });
        }

        // TODO: Fetch products and other related data as well
        return NextResponse.json(userStore[0]);

    } catch (error) {
        console.error("[EDITOR_STORE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// UPDATE Store Data
export async function PUT(request: Request) {
    try {
        // Usar el mismo UUID temporal que en GET
        const userId = "00000000-0000-0000-0000-000000000001";
        const values = await request.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!values) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        const [updatedStore] = await db.update(stores)
            .set(values)
            .where(eq(stores.userId, userId))
            .returning();

        return NextResponse.json(updatedStore);

    } catch (error) {
        console.error("[EDITOR_STORE_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
