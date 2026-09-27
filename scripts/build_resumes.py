"""Build downloadable bilingual resumes from data/resume.json.

Edit data/resume.json, then run this file with the bundled Python runtime.
"""
import json
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "data" / "resume.json").read_text())
OUT = ROOT / "static" / "downloads"
OUT.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm
INK = HexColor("#191a17")
MUTED = HexColor("#66685f")
ACCENT = HexColor("#567100")
RULE = HexColor("#c9c9c0")

# Embed the local CJK font so Chinese text remains readable after downloading.
pdfmetrics.registerFont(TTFont("STHeiti", "/System/Library/Fonts/STHeiti Medium.ttc", subfontIndex=0))

def wrapped_lines(text, font, size, width):
    words = text.split(" ") if font == "Helvetica" else list(text)
    lines, line = [], ""
    for word in words:
        probe = f"{line} {word}".strip() if font == "Helvetica" else line + word
        if pdfmetrics.stringWidth(probe, font, size) <= width:
            line = probe
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines

def write_wrapped(c, text, x, y, width, font, size, color, leading=5.2 * mm):
    c.setFont(font, size)
    c.setFillColor(color)
    for line in wrapped_lines(text, font, size, width):
        c.drawString(x, y, line)
        y -= leading
    return y

def draw_section(c, title, rows, y, is_zh):
    text_font = "STHeiti" if is_zh else "Helvetica"
    c.setStrokeColor(RULE)
    c.line(MARGIN, y, PAGE_W - MARGIN, y)
    y -= 8 * mm
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(ACCENT)
    c.drawString(MARGIN, y, title.upper())
    y -= 7 * mm
    date_x = PAGE_W - MARGIN - 42 * mm
    left_w = date_x - MARGIN - 7 * mm
    for organization, role, dates in rows:
        c.setFont(text_font, 10.4)
        c.setFillColor(INK)
        c.drawString(MARGIN, y, organization)
        c.setFont("Helvetica", 9.2)
        c.setFillColor(MUTED)
        c.drawRightString(PAGE_W - MARGIN, y, dates)
        y -= 5.8 * mm
        y = write_wrapped(c, role, MARGIN, y, left_w, text_font, 8.7, MUTED, 4.7 * mm)
        y -= 3.2 * mm
    return y

def build(language):
    info = DATA[language]
    is_zh = language == "zh"
    filename = OUT / ("yu-xiang-lin-resume-zh.pdf" if is_zh else "yu-xiang-lin-resume-en.pdf")
    c = canvas.Canvas(str(filename), pagesize=A4)
    c.setTitle(f"{DATA['name']} - {info['title']}")
    c.setAuthor(DATA["name"])
    title_font = "STHeiti" if is_zh else "Helvetica-Bold"
    text_font = "STHeiti" if is_zh else "Helvetica"
    y = PAGE_H - MARGIN
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(MARGIN, y, DATA["name"])
    y -= 8 * mm
    c.setFont(title_font, 11)
    c.setFillColor(ACCENT)
    c.drawString(MARGIN, y, info["title"])
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawRightString(PAGE_W - MARGIN, y, DATA["email"])
    y -= 10 * mm
    y = write_wrapped(c, info["summary"], MARGIN, y, PAGE_W - 2 * MARGIN, text_font, 9.2, MUTED)
    y -= 3 * mm
    labels = ("學歷 / BIO", "工作 / WORK", "特殊經歷 / EXPERIENCE", "研究與技能 / RESEARCH & SKILLS") if is_zh else ("Education", "Work", "Experience", "Research & Skills")
    y = draw_section(c, labels[0], info["education"], y, is_zh)
    y = draw_section(c, labels[1], info["work"], y, is_zh)
    y = draw_section(c, labels[2], info["experience"], y, is_zh)
    c.setStrokeColor(RULE)
    c.line(MARGIN, y, PAGE_W - MARGIN, y)
    y -= 8 * mm
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MARGIN, y, labels[3].upper())
    y -= 6 * mm
    write_wrapped(c, info["skills"], MARGIN, y, PAGE_W - 2 * MARGIN, text_font, 9.1, INK)
    c.showPage()
    c.save()

for lang in ("zh",):
    build(lang)
