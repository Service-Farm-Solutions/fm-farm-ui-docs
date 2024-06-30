export default function Root() {
  return (
    <main className="bg-slate-100 min-h-screen text-center">
      <header className="pt-12 pb-24 px-4 bg-gradient-to-br from-slate-700 to-black">
        <div className="flex items-center justify-center p-4"></div>
        <h1 className="text-white text-4xl font-medium drop-shadow-sm"> FM Farm - UI Docs </h1>
        <p className="text-lg mt-4 text-slate-300">FM Farm UI Docs to build design systems consistent.</p>
      </header>
      <nav>
        <ul className="flex gap-4 max-w-5xl mx-auto text-left mt-12 justify-center">
          <a href={`${import.meta.env.BASE_URL}components/introduction`} className="flex flex-col flex-none w-auto bg-white rounded-md hover:-translate-y-1 hover:shadow-lg transition-all items-center p-4">
            <img src={`${import.meta.env.BASE_URL}Core.jpg`} loading="eager" alt="Components" width="300" height="300" decoding="async" />
            <h2 className="text-lg font-medium">Components</h2>
            <p className="text-slate-500">Base Components, Dynamic Views and more.</p>
          </a>
        </ul>
      </nav>
    </main>
  )
}