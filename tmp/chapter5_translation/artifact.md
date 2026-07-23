# Template execution contract

## Reference

- Reference DOCX: `C:\Users\13557\Desktop\zlabscholar\tmp\chapter5_translation\template.docx`
- SHA-256: `CBE927001D6C651D5B318C60B0BF4EEA29DFA012AB7AF3A9D773656B8CC9C353`
- Baseline render: 2 pages, stored in `template_render`; exported through Microsoft Word because LibreOffice is unavailable.
- Evidence: `template_style_evidence.json`, `inspection.txt`, and the outputs of `section_audit.py`, `images_audit.py`, and `fields_report.py`.

## Page system

- One portrait US Letter section, 8.5 x 11 in.
- Margins: 1 in on every side.
- Empty header. Footer contains a centered PAGE field.
- No different-first-page or odd/even-page variants.

## Typography and paragraph roles

- Normal: Times New Roman, 14 pt, justified, 1.333 line spacing, 8 pt after.
- Cover title: direct formatting on Normal, 26 pt bold, centered, 10 pt after.
- Chapter label: direct formatting on Normal, 16 pt bold, left aligned, 6 pt before and 4 pt after.
- Chapter title: Heading 1, Times New Roman, 16 pt bold, centered, 18 pt before and 10 pt after.
- Section title: bold Normal paragraph, left aligned; source uses 14 pt inherited from Normal.
- Body paragraphs: Normal with a direct 28 pt first-line indent.
- Heading 2 exists at 13 pt bold, 12 pt before and 6 pt after and may be used for numbered subsections while retaining the template family.
- Caption: 10 pt bold, centered, 4 pt before, single spacing.

## Components and content flow

- Page 1 is a sparse cover with the centered book title and the PAGE field.
- Page 2 begins the chapter with the chapter label, centered chapter title, section heading, and body prose.
- Figures are centered inline images, followed by English Caption-style paragraphs.
- The source table may be inserted as a centered cropped image to honor the user's instruction to capture figures/tables from the PDF.

## Slot map

- Preserve paragraphs 0-11 and their formatting; paragraph 12 is the already translated first body paragraph and remains the first paragraph of section 5.1.
- Append the remainder of section 5.1 after paragraph 12.
- Add subsections 5.1.1 and 5.1.2, section 5.2, subsections 5.2.1 and 5.2.2, and References using the template's heading hierarchy.
- Insert Table 5-1 and Figures 5-1 through 5-15 at their corresponding semantic locations.
- Preserve the cover, section geometry, header/footer relationship, PAGE field, styles, numbering parts, and all unrelated package parts.

## Package preservation and fidelity gates

- Preserve `word/styles.xml`, `word/numbering.xml`, `word/header1.xml`, theme parts, settings, and the existing footer PAGE field.
- Add only body paragraphs, image relationships/media, and required drawing markup.
- The final document must retain one section, US Letter geometry, 1 in margins, cover design, and page-number footer.
- Render every final page through Microsoft Word and inspect for clipping, overlap, broken captions, blurred figures, and unintended page-layout changes.
