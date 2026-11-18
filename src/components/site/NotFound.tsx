import { Link } from "@tanstack/react-router";
import { KerfLine } from "./Kerf";

export function NotFoundPage() {
  return (
    <section className="container-site flex min-h-[70vh] flex-col justify-center pb-24 pt-36">
      <KerfLine label="404" className="mb-10 max-w-xl" />
      <h1 className="text-h1 max-w-3xl text-walnut">That page is not in the workshop.</h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">The link may be old, or the page may have moved.</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/shop" className="btn btn-primary">Shop the Collection</Link>
        <Link to="/contact" className="btn btn-secondary">Contact the Studio</Link>
      </div>
    </section>
  );
}
