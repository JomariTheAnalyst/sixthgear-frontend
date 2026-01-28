/**
 * Strapi Blocks Renderer
 *
 * Renders Strapi v5 rich text blocks (JSON format)
 * Supports: paragraphs, headings, lists, links
 */

import React from "react"

interface TextNode {
  type: "text"
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

interface LinkNode {
  type: "link"
  url: string
  children: TextNode[]
}

interface ListItemNode {
  type: "list-item"
  children: Array<TextNode | LinkNode>
}

interface BlockNode {
  type: "paragraph" | "heading" | "list" | "quote" | "code"
  level?: number // For headings (1-6)
  format?: "ordered" | "unordered" // For lists
  children: Array<TextNode | LinkNode | ListItemNode>
}

type RichTextBlock = BlockNode

interface BlocksRendererProps {
  content: RichTextBlock[]
  className?: string
}

/**
 * Render inline text with formatting
 */
function renderText(node: TextNode): React.ReactNode {
  let text: React.ReactNode = node.text

  if (node.bold) {
    text = <strong>{text}</strong>
  }
  if (node.italic) {
    text = <em>{text}</em>
  }
  if (node.underline) {
    text = <u>{text}</u>
  }
  if (node.strikethrough) {
    text = <s>{text}</s>
  }
  if (node.code) {
    text = (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{text}</code>
    )
  }

  return text
}

/**
 * Render link node
 */
function renderLink(node: LinkNode, index: number): React.ReactNode {
  return (
    <a
      key={index}
      href={node.url}
      className="text-[#F16D34] hover:underline"
      target={node.url.startsWith("http") ? "_blank" : undefined}
      rel={node.url.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {node.children.map((child, i) => (
        <React.Fragment key={i}>{renderText(child)}</React.Fragment>
      ))}
    </a>
  )
}

/**
 * Render inline content (text and links)
 */
function renderInlineContent(
  children: Array<TextNode | LinkNode>
): React.ReactNode[] {
  return children.map((child, index) => {
    if (child.type === "text") {
      return <React.Fragment key={index}>{renderText(child)}</React.Fragment>
    }
    if (child.type === "link") {
      return renderLink(child, index)
    }
    return null
  })
}

/**
 * Render a single block
 */
function renderBlock(block: RichTextBlock, index: number): React.ReactNode {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="mb-4 leading-relaxed">
          {renderInlineContent(block.children as Array<TextNode | LinkNode>)}
        </p>
      )

    case "heading":
      const level = block.level || 2
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
      const headingClasses = {
        1: "text-4xl font-bold mb-6 mt-8",
        2: "text-3xl font-bold mb-5 mt-7",
        3: "text-2xl font-bold mb-4 mt-6",
        4: "text-xl font-bold mb-3 mt-5",
        5: "text-lg font-bold mb-2 mt-4",
        6: "text-base font-bold mb-2 mt-3",
      }[level]

      return (
        <HeadingTag key={index} className={headingClasses}>
          {renderInlineContent(block.children as Array<TextNode | LinkNode>)}
        </HeadingTag>
      )

    case "list":
      const ListTag = block.format === "ordered" ? "ol" : "ul"
      const listClass =
        block.format === "ordered"
          ? "list-decimal list-inside mb-4 space-y-2"
          : "list-disc list-inside mb-4 space-y-2"

      return (
        <ListTag key={index} className={listClass}>
          {(block.children as ListItemNode[]).map((item, i) => (
            <li key={i} className="leading-relaxed">
              {renderInlineContent(item.children)}
            </li>
          ))}
        </ListTag>
      )

    case "quote":
      return (
        <blockquote
          key={index}
          className="border-l-4 border-[#F16D34] pl-4 italic my-4 text-gray-700"
        >
          {renderInlineContent(block.children as Array<TextNode | LinkNode>)}
        </blockquote>
      )

    case "code":
      return (
        <pre
          key={index}
          className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"
        >
          <code>
            {(block.children as TextNode[]).map((child) => child.text).join("")}
          </code>
        </pre>
      )

    default:
      console.warn("[BlocksRenderer] Unknown block type:", (block as any).type)
      return null
  }
}

/**
 * Main Blocks Renderer Component
 */
export default function BlocksRenderer({
  content,
  className = "",
}: BlocksRendererProps) {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return null
  }

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  )
}
