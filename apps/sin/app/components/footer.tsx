export function Footer() {
  return (
    <footer className="mt-8 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
      <p>
        © {new Date().getFullYear()} sinsin — built with React Router and Tailwind
      </p>
    </footer>
  );
}
