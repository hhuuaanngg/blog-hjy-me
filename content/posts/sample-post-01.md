---
title: "周末城市漫游：带图片与相册的样例文章"
date: "2026-03-14"
summary: "这是一篇用于演示 Markdown 文章效果的样例，包含普通图片、外部链接，以及多张图片组成的相册布局。"
category: "旅行随笔"
tags:
  - Sample
  - Markdown
  - Gallery
cover: "/images/post-cover-1.svg"
draft: false
---

如果你正在搭建自己的博客，这篇文章可以用来快速检查正文排版是否正常：标题、段落、链接、单张配图，以及相册式图片网格都已经包含在内。

## 一张主图

下面这张图适合测试正文中的大图展示、圆角、说明文字和上下留白。

<figure>
  <img src="/images/sample-article-photo-1.svg" alt="傍晚城市与河岸步道的示意图" />
  <figcaption>傍晚的河岸步道，适合用来测试正文中的单张配图效果。</figcaption>
</figure>

## 相关链接

你可以在正文中插入普通文本链接，例如访问 [Next.js 官方文档](https://nextjs.org/docs) 或 [Markdown Guide](https://www.markdownguide.org/)，用来测试链接颜色、下划线和 hover 表现。

如果你之后想扩展成“按钮式跳转”或“卡片式推荐”，也可以继续在 Markdown 中混合 HTML 区块来实现。

## 相册效果

下面这个区域使用一个简单的 HTML 容器来组成三张图片的相册。当前渲染链路支持原生 HTML，所以可以直接在文章里这样写。

<div class="post-gallery">
  <figure>
    <img src="/images/sample-article-photo-2.svg" alt="清晨咖啡店窗边座位的示意图" />
    <figcaption>清晨的咖啡店窗边。</figcaption>
  </figure>
  <figure>
    <img src="/images/sample-article-photo-3.svg" alt="街角书店与绿植的示意图" />
    <figcaption>适合慢慢逛的街角书店。</figcaption>
  </figure>
  <figure>
    <img src="/images/sample-article-photo-4.svg" alt="夜晚城市天际线的示意图" />
    <figcaption>夜晚的城市灯光与天际线。</figcaption>
  </figure>
</div>

## 使用建议

- 这篇文章适合用来测试博客正文的基础样式是否完整。
- 如果你后面想接入真实内容，只要替换标题、摘要、图片和链接即可。
- 如果你想继续升级，还可以在相册下面加入引用、代码块或表格，进一步检查排版细节。
