import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(200, '제목은 200자 이하여야 합니다'),
  description: z.string().max(1000, '설명은 1000자 이하여야 합니다').optional(),
});

export const updateTodoSchema = z.object({
  id: z.number(),
  title: z.string().min(1, '제목을 입력해주세요').max(200, '제목은 200자 이하여야 합니다').optional(),
  description: z.string().max(1000, '설명은 1000자 이하여야 합니다').optional(),
  completed: z.boolean().optional(),
});

export const deleteTodoSchema = z.object({
  id: z.number(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type DeleteTodoInput = z.infer<typeof deleteTodoSchema>;
