"use client";

import { FormEvent, useMemo, useState } from "react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

type FilterKey = "all" | "active" | "completed";

type FilterDefinition = {
  label: string;
  predicate: (task: Task) => boolean;
};

const INITIAL_TASKS: Task[] = [
  {
    id: "welcome",
    title: "Next.js プロジェクトをセットアップ",
    completed: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: "task-flow",
    title: "このタスク一覧を自由に編集してみよう",
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 60,
  },
];

const FILTERS: Record<FilterKey, FilterDefinition> = {
  all: {
    label: "すべて",
    predicate: () => true,
  },
  active: {
    label: "作業中",
    predicate: (task) => !task.completed,
  },
  completed: {
    label: "完了済み",
    predicate: (task) => task.completed,
  },
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const filteredTasks = useMemo(
    () => tasks.filter(FILTERS[filter].predicate),
    [tasks, filter]
  );

  const remainingCount = useMemo(
    () => tasks.filter(FILTERS.active.predicate).length,
    [tasks]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = newTaskTitle.trim();
    if (!trimmed) {
      return;
    }

    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
    ]);

    setNewTaskTitle("");
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-16 sm:px-10">
      <header className="space-y-3 text-center sm:text-left">
        <div className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">
          Project 1
        </div>
        <h1 className="text-3xl font-semibold sm:text-4xl">タスク管理</h1>
        <p className="text-sm text-slate-300 sm:text-base">
          タスクを登録・整理しながら、これから開発するアプリのアイデアを形にしていきましょう。
        </p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl shadow-sky-900/20 backdrop-blur">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-4 shadow-inner shadow-black/20 sm:flex-row"
        >
          <label className="sr-only" htmlFor="taskTitle">
            新しいタスク
          </label>
          <input
            id="taskTitle"
            name="taskTitle"
            value={newTaskTitle}
            onChange={(event) => setNewTaskTitle(event.target.value)}
            placeholder="次にやることを書きましょう"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-slate-100 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
            autoComplete="off"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          >
            <span className="hidden sm:inline">タスクを追加</span>
            <span className="sm:hidden">追加</span>
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex gap-2" aria-label="タスクの絞り込み">
              {(Object.keys(FILTERS) as FilterKey[]).map((key) => {
                const { label } = FILTERS[key];
                const isActive = filter === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${
                      isActive
                        ? "bg-sky-500 text-white shadow"
                        : "bg-white/5 text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </nav>
            <div className="flex items-center justify-between gap-4 text-xs text-slate-300 sm:text-sm">
              <span>残り {remainingCount} 件</span>
              <button
                type="button"
                onClick={clearCompleted}
                className="text-sky-300 underline-offset-4 transition hover:text-sky-200 hover:underline"
                disabled={!tasks.some((task) => task.completed)}
              >
                完了済みを一括削除
              </button>
            </div>
          </div>

          <ul className="space-y-2" aria-live="polite">
            {filteredTasks.length === 0 && (
              <li className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-slate-300">
                表示できるタスクがありません。フィルターの条件を変えるか、新しいタスクを追加してください。
              </li>
            )}

            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-slate-950/70 p-4 transition hover:border-sky-400/60 hover:bg-slate-900"
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`flex flex-1 items-center gap-3 text-left text-base transition ${
                    task.completed ? "text-slate-400" : "text-slate-100"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                      task.completed
                        ? "border-sky-400 bg-sky-500/20 text-sky-200"
                        : "border-white/20 bg-slate-950"
                    }`}
                    aria-hidden
                  >
                    {task.completed ? "✓" : ""}
                  </span>
                  <span className={task.completed ? "line-through" : undefined}>
                    {task.title}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  className="rounded-full border border-transparent px-3 py-1 text-xs font-medium text-slate-400 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="pb-10 text-center text-xs text-slate-500 sm:text-sm">
        このページを出発点に、バックエンド連携やユーザー管理などの機能を育てていきましょう。
      </footer>
    </main>
  );
}
