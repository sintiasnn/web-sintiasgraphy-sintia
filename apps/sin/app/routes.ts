import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home/page.tsx"),
    route("about", "routes/about/page.tsx"),
    route("blog", "routes/blog/page.tsx"),
    route("photos", "routes/photos/page.tsx"),
    route("books", "routes/books/page.tsx"),
    route("contact", "routes/contact/page.tsx"),
    route("login", "routes/auth/login/page.tsx"),
] satisfies RouteConfig;
