'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { todos } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import {
  createTodoSchema,
  updateTodoSchema,
  deleteTodoSchema,
  type CreateTodoInput,
  type UpdateTodoInput,
  type DeleteTodoInput,
} from '@/lib/validations';
import { initDatabase } from '@/db/init';

// Initialize database on first load
try {
  initDatabase();
} catch (error) {
  console.error('Database initialization error:', error);
}

export async function getTodos() {
  try {
    const allTodos = await db.select().from(todos).orderBy(desc(todos.createdAt));
    return { success: true, data: allTodos };
  } catch (error) {
    console.error('Get todos error:', error);
    return { success: false, error: 'TODO 목록을 불러오는데 실패했습니다.' };
  }
}

export async function createTodo(input: CreateTodoInput) {
  try {
    const validated = createTodoSchema.parse(input);
    
    const [newTodo] = await db
      .insert(todos)
      .values({
        title: validated.title,
        description: validated.description || null,
        completed: false,
      })
      .returning();

    revalidatePath('/');
    return { success: true, data: newTodo };
  } catch (error) {
    console.error('Create todo error:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'TODO 생성에 실패했습니다.' };
  }
}

export async function updateTodo(input: UpdateTodoInput) {
  try {
    const validated = updateTodoSchema.parse(input);
    
    const updateData: any = {
      updatedAt: sql`(unixepoch())`,
    };

    if (validated.title !== undefined) {
      updateData.title = validated.title;
    }
    if (validated.description !== undefined) {
      updateData.description = validated.description;
    }
    if (validated.completed !== undefined) {
      updateData.completed = validated.completed;
    }

    const [updatedTodo] = await db
      .update(todos)
      .set(updateData)
      .where(eq(todos.id, validated.id))
      .returning();

    if (!updatedTodo) {
      return { success: false, error: 'TODO를 찾을 수 없습니다.' };
    }

    revalidatePath('/');
    return { success: true, data: updatedTodo };
  } catch (error) {
    console.error('Update todo error:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'TODO 수정에 실패했습니다.' };
  }
}

export async function deleteTodo(input: DeleteTodoInput) {
  try {
    const validated = deleteTodoSchema.parse(input);
    
    const [deletedTodo] = await db
      .delete(todos)
      .where(eq(todos.id, validated.id))
      .returning();

    if (!deletedTodo) {
      return { success: false, error: 'TODO를 찾을 수 없습니다.' };
    }

    revalidatePath('/');
    return { success: true, data: deletedTodo };
  } catch (error) {
    console.error('Delete todo error:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'TODO 삭제에 실패했습니다.' };
  }
}

export async function toggleTodo(id: number) {
  try {
    // Get current todo
    const [currentTodo] = await db.select().from(todos).where(eq(todos.id, id));
    
    if (!currentTodo) {
      return { success: false, error: 'TODO를 찾을 수 없습니다.' };
    }

    // Toggle completed status
    const [updatedTodo] = await db
      .update(todos)
      .set({
        completed: !currentTodo.completed,
        updatedAt: sql`(unixepoch())`,
      })
      .where(eq(todos.id, id))
      .returning();

    revalidatePath('/');
    return { success: true, data: updatedTodo };
  } catch (error) {
    console.error('Toggle todo error:', error);
    return { success: false, error: 'TODO 상태 변경에 실패했습니다.' };
  }
}
