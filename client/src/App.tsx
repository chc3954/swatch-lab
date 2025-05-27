import { Footer } from './components/layouts/Footer';
import { Header } from './components/layouts/Header';
import { Preview } from './components/layouts/Preview';
import { Sidebar } from './components/layouts/Sidebar';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-1 bg-[var(--background)]">
        <Sidebar />
        <Preview />
      </main>
      <Footer />
    </div>
  );
}

export default App;
