# Updating the downloadable resumes

1. Edit `data/resume.json` to change the Chinese or English wording.
2. Run `build_resumes.py` using the bundled workspace Python runtime.
3. The generated Chinese PDF is written to `static/downloads/` and will be published by Hugo.

The About page links to the `/resume/` preview page, so it needs no changes when the Chinese PDF filename stays the same.
