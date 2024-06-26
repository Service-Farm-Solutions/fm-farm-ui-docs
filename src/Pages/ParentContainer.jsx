import { NavLink } from "react-router-dom";

export default function ParentContainer() {
  return (
    <main className="dark text-foreground h-screen bg-slate-100 min-h-screen">
      <div class="sticky top-0 z-10 w-full">
        <header class="p-3 bg-slate-100 bg-opacity-80 backdrop-blur-md border-b text-slate-900">
          <nav title="Top Navigation" class="max-w-7xl mx-auto flex justify-between items-center px-4">
            <div>
              <NavLink class="text-lg font-medium" href="/">
                <h1> FM Farm - UI Docs </h1>
              </NavLink>
            </div>
            <div class="flex gap-2">
              <a title="FM Farm" target="_blank" class="opacity-80 hover:opacity-100 hover:bg-blue-50 p-2 rounded-full transition-colors" href="https://service.farm/fm-farm/">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-4">
                  <title>Link</title>
                  <path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"></path>
                </svg>
              </a>
            </div>
          </nav>
        </header>
      </div>
    </main>
  );
}
