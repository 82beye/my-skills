'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toggleTodo, deleteTodo, updateTodo } from '@/app/actions';
import { toast } from 'sonner';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Todo } from '@/db/schema';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleTodo(todo.id);
      if (!result.success) {
        toast.error(result.error || 'TODO 상태 변경에 실패했습니다');
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    startTransition(async () => {
      const result = await deleteTodo({ id: todo.id });
      if (result.success) {
        toast.success('TODO가 삭제되었습니다');
      } else {
        toast.error(result.error || 'TODO 삭제에 실패했습니다');
      }
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const handleSave = () => {
    if (!editTitle.trim()) {
      toast.error('제목을 입력해주세요');
      return;
    }

    startTransition(async () => {
      const result = await updateTodo({
        id: todo.id,
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });

      if (result.success) {
        toast.success('TODO가 수정되었습니다');
        setIsEditing(false);
      } else {
        toast.error(result.error || 'TODO 수정에 실패했습니다');
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const formatDate = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className={todo.completed ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              disabled={isPending}
              placeholder="제목"
            />
            <Input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              disabled={isPending}
              placeholder="설명"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isPending}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-1" />
                저장
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-1" />
                취소
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggle}
                disabled={isPending}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-base font-medium break-words ${
                    todo.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className="text-sm text-muted-foreground mt-1 break-words">
                    {todo.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    생성: {formatDate(todo.createdAt)}
                  </Badge>
                  {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
                    <Badge variant="outline" className="text-xs">
                      수정: {formatDate(todo.updatedAt)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
                disabled={isPending}
                className="flex-1"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                수정
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                삭제
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
