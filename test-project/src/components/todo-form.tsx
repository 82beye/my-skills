'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createTodo } from '@/app/actions';
import { toast } from 'sonner';

export function TodoForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('제목을 입력해주세요');
      return;
    }

    startTransition(async () => {
      const result = await createTodo({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      if (result.success) {
        toast.success('TODO가 생성되었습니다');
        setTitle('');
        setDescription('');
      } else {
        toast.error(result.error || 'TODO 생성에 실패했습니다');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="할 일을 입력하세요..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
          className="text-base"
        />
        <Input
          type="text"
          placeholder="설명 (선택사항)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isPending}
          className="text-base"
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? '추가 중...' : '추가하기'}
      </Button>
    </form>
  );
}
