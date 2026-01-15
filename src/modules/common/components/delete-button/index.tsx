import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    await deleteLineItem(id).catch((err) => {
      setIsDeleting(false)
    })
  }

  return (
    <button
      className={clx(
        "flex items-center gap-x-1 text-red-500 hover:text-red-700 cursor-pointer transition-colors",
        className
      )}
      onClick={() => handleDelete(id)}
    >
      {isDeleting ? (
        <Spinner className="animate-spin w-5 h-5" />
      ) : (
        <Trash className="w-5 h-5" />
      )}
      {children && <span>{children}</span>}
    </button>
  )
}

export default DeleteButton
