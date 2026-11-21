"""文档纯文本解析：txt / md / pdf / xlsx。"""
from pathlib import Path

SUPPORTED_SUFFIXES = {".txt", ".md", ".pdf", ".xlsx", ".xlsm"}


def parse_file(path: Path) -> str:
    """按扩展名解析文档为纯文本。"""
    suffix = path.suffix.lower()
    if suffix in {".txt", ".md"}:
        return path.read_text(encoding="utf-8", errors="ignore")
    if suffix == ".pdf":
        return parse_pdf(path)
    if suffix in {".xlsx", ".xlsm"}:
        return parse_excel(path)
    raise ValueError(f"不支持的文档格式: {suffix}")


def parse_pdf(path: Path) -> str:
    """提取 PDF 每页文本。"""
    from pypdf import PdfReader

    reader = PdfReader(str(path))
    parts = []
    for i, page in enumerate(reader.pages, 1):
        text = (page.extract_text() or "").strip()
        if text:
            parts.append(f"[第 {i} 页]\n{text}")
    return "\n\n".join(parts) or "（PDF 未提取到文本，可能是扫描件）"


def parse_excel(path: Path) -> str:
    """提取 Excel 各工作表单元格文本。"""
    from openpyxl import load_workbook

    wb = load_workbook(str(path), read_only=True, data_only=True)
    parts = []
    for ws in wb.worksheets:
        rows = []
        for row in ws.iter_rows(values_only=True):
            cells = [str(c).strip() for c in row if c is not None and str(c).strip()]
            if cells:
                rows.append("\t".join(cells))
        if rows:
            parts.append(f"[Sheet: {ws.title}]\n" + "\n".join(rows))
    return "\n\n".join(parts) or "（Excel 为空）"
