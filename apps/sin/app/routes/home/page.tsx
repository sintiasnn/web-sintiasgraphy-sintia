import type { Route } from "./+types/page";
import { Welcome } from "./welcome";

export function meta(_props: Route.MetaArgs) {
  return [
    { title: "sintiasgraphy — Home" },
    { name: "description", content: "Personal site of Ni Putu Sintia Wati: photos, projects, and notes." },
  ];
}

export default function Page() {
	return <Welcome />;
}
