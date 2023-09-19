'use client'

import Modal from '@/app/components/Modal'
import Image from 'next/image'
import React, { FC } from 'react'

interface ImageModalProps {
  src?: string | null
  isOpen?: boolean
  onClose: () => void
}

const ImageModal: FC<ImageModalProps> = ({ src, isOpen, onClose }) => {
  if (!src) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="h-80 w-80">
        <Image alt="Image" className="object-cover" fill src={src} />
      </div>
    </Modal>
  )
}

export default ImageModal
