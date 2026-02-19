\# 3D Print Catalog (GitHub Pages, zero build)



This is a static site designed for GitHub Pages.

No npm, no Vite, no React build — just HTML/CSS/JS.



\## Deploy (GitHub Pages)

1\. Push this repo to GitHub

2\. Repo Settings → Pages

3\. Source: `Deploy from a branch`

4\. Branch: `main` (or `master`), Folder: `/root`

5\. Save — your site will be live at the Pages URL.



\## How to add a product (fast)

1\. Create a folder:

&nbsp;  - `products/<your-slug>/`

2\. Add files:

&nbsp;  - `products/<your-slug>/product.json`

&nbsp;  - `products/<your-slug>/images/` (put images here)

&nbsp;  - (optional) `products/<your-slug>/video.mp4`

3\. Update the manifest:

&nbsp;  - open `products/products.json`

&nbsp;  - add `<your-slug>` to the `products` array



That’s it — it will appear on the Products page and (if it’s in the first 3) on Home Featured.



\## Product JSON format

Required:

\- name

\- price (display only)

\- shortDescription

\- fullDescription

\- contactEmail

\- optionalTags



Also required for images (because static sites can’t list folders):

\- images: \["1.jpg", "2.jpg", "3.png"]



Optional:

\- video: "video.mp4"

\- created: "YYYY-MM-DD" (used for “featured” order)



