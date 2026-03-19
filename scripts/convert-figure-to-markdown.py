#!/usr/bin/env python3
"""
将 markdown 文章中的 <figure> 包裹的图片转换为 markdown 图片语法 ![](src)
支持：gallery、单图、figcaption、video（转为链接）
"""
import re
import sys
from pathlib import Path


def extract_imgs_from_figure(inner: str) -> list[tuple[str, str]]:
    """从 figure 内部 HTML 提取所有 img 的 (src, alt)。figcaption 作为紧跟的 img 的 alt。"""
    # 先找 <figcaption>...</figcaption>，可能紧跟在 </figure> 或 <img> 后
    # 按顺序：每遇到 <img> 取 src/alt，若后面紧跟 <figcaption> 则用其内容作为 alt（若 alt 为空）
    results = []
    # 匹配 <img ... src="..." ... alt="..." ...> 或 src 和 alt 顺序相反
    img_pattern = re.compile(
        r'<img\s[^>]*?src=["\']([^"\']+)["\'][^>]*?(?:alt=["\']([^"\']*)["\'])?[^>]*?>',
        re.IGNORECASE | re.DOTALL
    )
    # 也匹配 alt 在 src 前面的
    img_pattern_alt_first = re.compile(
        r'<img\s[^>]*?alt=["\']([^"\']*)["\'][^>]*?src=["\']([^"\']+)["\'][^>]*?>',
        re.IGNORECASE | re.DOTALL
    )
    figcaption_pattern = re.compile(r'<figcaption[^>]*>([^<]*)</figcaption>', re.IGNORECASE)

    # 找所有 img 标签的完整匹配
    pos = 0
    while pos < len(inner):
        m = img_pattern.search(inner, pos)
        m2 = img_pattern_alt_first.search(inner, pos)
        if m and (not m2 or m.start() <= m2.start()):
            src, alt = m.group(1), (m.group(2) or "").strip()
            end = m.end()
        elif m2:
            alt, src = (m2.group(1) or "").strip(), m2.group(2)
            end = m2.end()
        else:
            break
        # 检查紧跟的 figcaption（在同一 figure 内）
        after = inner[end:end + 200]
        fc = figcaption_pattern.match(after)
        if fc and not alt:
            alt = fc.group(1).strip()
        results.append((src, alt))
        pos = end
    return results


def extract_video_from_figure(inner: str) -> str | None:
    """若是 video 块，返回 video 的 src，否则返回 None。"""
    m = re.search(r'<video[^>]*\ssrc=["\']([^"\']+)["\']', inner, re.IGNORECASE)
    return m.group(1) if m else None


def extract_audio_from_figure(inner: str) -> str | None:
    """若是 audio 块，返回 audio 的 src，否则返回 None。"""
    m = re.search(r'<audio[^>]*\ssrc=["\']([^"\']+)["\']', inner, re.IGNORECASE)
    return m.group(1) if m else None


def figure_to_markdown(inner: str) -> str | None:
    """将 figure 内部内容转为 markdown。若无法解析则返回 None。"""
    video_src = extract_video_from_figure(inner)
    if video_src:
        return f'[观看视频]({video_src})'
    audio_src = extract_audio_from_figure(inner)
    if audio_src:
        return f'[收听音频]({audio_src})'

    imgs = extract_imgs_from_figure(inner)
    if imgs:
        lines = []
        for src, alt in imgs:
            lines.append(f'![{alt}]({src})' if alt else f'![]({src})')
        return '\n\n'.join(lines)
    # 内容已是 markdown 图片（上一轮替换后只剩 ![](...)），去掉 figure 外壳并每图一行
    stripped = inner.strip()
    if re.search(r'!\[.*?\]\([^)]+\)', stripped):
        # 将连在一起的 ![](a)![](b) 拆成多行
        parts = re.findall(r'!\[.*?\]\([^)]+\)', stripped)
        return '\n\n'.join(parts)
    return None


def convert_content(content: str) -> str:
    """将内容中所有 <figure>...</figure> 替换为 markdown。从内层开始替换。"""
    # 用非贪婪匹配找最内层 figure（内容里不再包含 <figure）
    # 即 <figure ...> 后面直到 </figure>，且中间没有 <figure
    pattern = re.compile(
        r'<figure(?:\s[^>]*)?>((?:(?!<figure).)*?)</figure>',
        re.IGNORECASE | re.DOTALL
    )
    out = content
    changed = True
    while changed:
        changed = False
        def repl(m):
            nonlocal changed
            inner = m.group(1)
            md = figure_to_markdown(inner)
            if md is not None:
                changed = True
                return md
            return m.group(0)
        out = pattern.sub(repl, out)
    return out


def main():
    posts_dir = Path(__file__).resolve().parent.parent / "content" / "posts"
    if not posts_dir.is_dir():
        print("posts dir not found:", posts_dir, file=sys.stderr)
        sys.exit(1)

    count = 0
    for path in sorted(posts_dir.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        if "<figure" not in text:
            continue
        new_text = convert_content(text)
        if new_text != text:
            path.write_text(new_text, encoding="utf-8")
            count += 1
            print(path.name)
    print(f"Done. Converted {count} files.")


if __name__ == "__main__":
    main()
