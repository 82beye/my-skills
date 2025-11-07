import { getTodos } from './actions';
import { TodoForm } from '@/components/todo-form';
import { TodoList } from '@/components/todo-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const result = await getTodos();
  const todos = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <main className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">TODO 관리 시스템</h1>
          <p className="text-muted-foreground">
            Next.js 16 + SQLite + Drizzle ORM으로 만든 TODO 앱
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>새로운 TODO 추가</CardTitle>
            <CardDescription>
              할 일을 추가하고 효율적으로 관리하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TodoForm />
          </CardContent>
        </Card>

        <div>
          <TodoList todos={todos} />
        </div>

        {!result.success && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive text-center">
                {result.error || '데이터를 불러오는데 실패했습니다.'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
