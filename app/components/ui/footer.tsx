export default function Footer({ border = false }: { border?: boolean }) {
  return (
    <footer>
      Goat Attack {new Date().getFullYear()}
    </footer>
  );
}