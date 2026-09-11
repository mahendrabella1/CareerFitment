# Static images

Files in this folder are served from the site root.

## Home "Why this matters" illustration
Save the traveller / signpost / mountain illustration here as:

    public/why-this-matters.png

The home page loads it at `/why-this-matters.png`. Until the file exists, the
page automatically falls back to a built-in SVG version of the same scene, so
nothing breaks either way. (A `.jpg` works too — just update the path in
`app/Landing.tsx` → `WhyArt`.)
